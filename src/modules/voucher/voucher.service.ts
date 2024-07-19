import { ClientSession, QueryRunner, Repository } from "typeorm";
import appDataSource from "../../libs/database";
import { EventService } from "../event/event.service";
import { Voucher } from "./voucher.entity";
import { CreateVoucherInput } from "./voucher.input";
import { emailQueue } from "../../queues/email.queue";

export class VoucherService {
  private readonly voucherRepository: Repository<Voucher>;
  private readonly eventService: EventService;

  constructor() {
    this.voucherRepository = appDataSource.getRepository(Voucher);

    this.eventService = new EventService();
  }

  getVouchers(): Promise<Voucher[]> {
    return this.voucherRepository.find({ relations: ["event"] });
  }

  async createVoucher(data: CreateVoucherInput): Promise<Voucher> {
    const queryRunner = appDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const event = await this.eventService.getEventById(data.eventId);

      if (!event) {
        throw new Error("Event not found");
      }

      if (event.quantity >= event.maxQuantity) {
        throw new Error("Event is full");
      }

      const voucher = this.voucherRepository.create({
        code: this.generateCode(),
        discount: data.discount,
        event: { id: event.id },
      });

      await queryRunner.manager.save(voucher);

      event.quantity = Number(event.quantity) + 1;
      await queryRunner.manager.save(event);

      await emailQueue.add("sendVoucherEmail", {
        to: "abc@mailinator.com",
        voucherCode: voucher.code,
      });

      await this._commitWithRetry(queryRunner);
      return voucher;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async _commitWithRetry(queryRunner: QueryRunner) {
    let retries = 0;

    try {
      await queryRunner.commitTransaction();
    } catch (error) {
      if (retries >= 3) {
        throw error;
      }

      await this._commitWithRetry(queryRunner);
      retries++;
    }
  }

  async deleteVoucher(id: number): Promise<boolean> {
    const voucher = await this.voucherRepository.findOne({
      where: { id },
      relations: ["event"],
    });

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    await appDataSource.manager.remove(voucher);
    voucher.event.quantity -= 1;
    await appDataSource.manager.save(voucher.event);

    return true;
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
