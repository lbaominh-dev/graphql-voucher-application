import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Voucher } from "../voucher/voucher.entity";
import { User } from "../user/user.entity";

@Entity()
@ObjectType()
export class Event extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  date!: Date;

  @Field(() => Number, { defaultValue: 10 })
  @Column()
  maxQuantity!: number;

  @Field(() => Number, { defaultValue: 0 })
  @Column("numeric", { default: 0 })
  quantity!: number;

  @Field(() => [Voucher])
  @OneToMany(() => Voucher, (voucher) => voucher.event)
  vouchers!: Voucher[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, { eager: true, nullable: true })
  @JoinColumn()
  editingUser?: User;

  @Field({ nullable: true })
  @Column("timestamp", { nullable: true })
  editingExpired?: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
