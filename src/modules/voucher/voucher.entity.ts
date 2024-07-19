import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "../event/event.entity";

@Entity()
@ObjectType()
export class Voucher extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field()
  @Column()
  code!: string;

  @Field()
  @Column()
  discount!: number;

  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.vouchers)
  event!: Event;
}
