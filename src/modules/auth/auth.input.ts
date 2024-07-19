import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(6, 20)
  password!: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;
  
  @Field()
  @Length(6, 20)
  password!: string;

  @Field({ nullable: true })
  userName?: string;
}
