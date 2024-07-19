import { Field, InputType } from "type-graphql";
import { User } from "./user.entity";
import { IsEmail } from "class-validator";

@InputType()
export class CreateUserInput implements Partial<User> {
    @Field()
    @IsEmail()
    email!: string;

    @Field()
    password!: string;

    @Field({ nullable: true })
    userName?: string;
}
