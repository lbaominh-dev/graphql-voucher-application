import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { LoginInput, RegisterInput } from "./auth.input";
import { AuthService } from "./auth.service";
import { User } from "../user/user.entity";
import { TokenResponse } from "./auth.type";
import { Context } from "../../context.type";

@Resolver()
export class AuthResolver {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context) {
    if (!ctx.user?.hasId) return null;
    return ctx.user
  }

  @Mutation(() => TokenResponse, { nullable: true })
  async login(@Arg("data") data: LoginInput) {
    return this.authService.login(data.email, data.password);
  }

  @Mutation(() => User)
  async register(@Arg("data") data: RegisterInput) {
    return this.authService.register(data);
  }

  @Mutation(() => TokenResponse, { nullable: true })
  async refreshToken(@Arg("refreshToken") refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
