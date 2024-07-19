import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "./user.entity";
import { CreateUserInput } from "./user.input";
import { UserService } from "./user.service";

@Resolver(User)
export class UserResolver {
  private readonly userService: UserService 

  constructor() {
    this.userService = new UserService();
  }

  @Query(() => [User])
  async users() {
    return this.userService.getUsers()
  }

  @Mutation(() => User)
  async createUser(@Arg("data") newUser: CreateUserInput) {
    return this.userService.createUser(newUser)
  }
}
