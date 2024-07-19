import { Queue, Worker } from "bullmq";
import { connection, QueueName } from "./config";
import emailService from "../modules/email/email.service";

export const emailQueue = new Queue(QueueName.EMAIL, { connection });

const worker = new Worker(
  QueueName.EMAIL,
  async (job) => {
    if (job.name === "sendMailVoucher") {
      const { to, voucherCode } = job.data;
      emailService.sendMailVoucher(to, voucherCode);
    }
  },
  {
    connection,
    autorun: false,
  }
);

const graceful = async () => {
  await worker.close();
  await emailQueue.close();
  process.exit(0);
}
