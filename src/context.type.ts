import { User } from "./modules/user/user.entity";

export interface Context {
  req: {
    headers: {
      authorization: string;
    };
  };

  user?: User | null;
}

export interface AuthorizedContext extends Context {
  user: User;
}
