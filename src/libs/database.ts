import { DataSource } from "typeorm";
import { User } from "../modules/user/user.entity";
import { Voucher } from "../modules/voucher/voucher.entity";
import { Event } from "../modules/event/event.entity";

const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "123456",
  database: "voucher-application",
  entities: [User, Event, Voucher],
  synchronize: true,
  poolSize: 10,
});

export const connectDatabase = async () => {
  try {
    await appDataSource.initialize();

    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to database: ", error);
  }
};

export default appDataSource;
