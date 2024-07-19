import { Max, Min } from "class-validator";
import { Field, ID, InputType } from "type-graphql";
import { Voucher } from "./voucher.entity";

@InputType()
export class CreateVoucherInput implements Partial<Voucher> {
  @Field()
  @Max(100)
  @Min(1)
  discount!: number;

  @Field(() => ID)
  eventId!: number;
}
