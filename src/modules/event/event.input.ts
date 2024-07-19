import { Field, InputType } from "type-graphql";
import { Event } from "./event.entity";

@InputType()
export class CreateEventInput implements Partial<Event> {
  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  date!: Date;

  @Field({ defaultValue: 10, nullable: true })
  maxQuantity!: number;
}
