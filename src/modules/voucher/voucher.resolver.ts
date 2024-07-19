import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Voucher } from "./voucher.entity";
import { CreateVoucherInput } from "./voucher.input";
import { VoucherService } from "./voucher.service";

@Resolver()
export class VoucherResolver {
  private readonly voucherService: VoucherService;

  constructor() {
    this.voucherService = new VoucherService();
  }

  @Query(() => [Voucher])
  async vouchers() {
    return this.voucherService.getVouchers();
  }

  @Mutation(() => Voucher)
  async createVoucher(@Arg("data") newVoucher: CreateVoucherInput) {
    return this.voucherService.createVoucher(newVoucher);
  }

  @Mutation(() => Boolean)
  async deleteVoucher(@Arg("id") id: number) {
    return this.voucherService.deleteVoucher(id);
  }
}
