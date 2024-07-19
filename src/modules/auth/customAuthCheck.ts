import { AuthCheckerInterface, ResolverData } from "type-graphql";
import { Context } from "../../context.type";
import { AuthService } from "./auth.service";

export class CustomAuthChecker implements AuthCheckerInterface<Context> {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  check = async ({ context }: ResolverData<Context>) => {
    const authorization = context.req.headers.authorization;

    if (!authorization) {
      return false;
    }

    try {
      const token = authorization.split(" ")[1];
      const user = await this.authService.validateToken(token);
      context.user = user;
      return !!user;
    } catch (err) {
      return false;
    }
  };
}
