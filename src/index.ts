import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { connectDatabase } from "./libs/database";
import { AuthResolver } from "./modules/auth/auth.resolver";
import { CustomAuthChecker } from "./modules/auth/customAuthCheck";
import { UserResolver } from "./modules/user/user.resolver";
import { EventResolver } from "./modules/event/event.resolver";
import { VoucherResolver } from "./modules/voucher/voucher.resolver";
import { ResolveTime } from "./common/resolveTime.middleware";
import { ErrorInterceptor } from "./common/error";

const startServer = async () => {
  await connectDatabase();

  const customAuthChecker = new CustomAuthChecker();

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, EventResolver, VoucherResolver],
    globalMiddlewares: [ResolveTime, ErrorInterceptor],
    authChecker: customAuthChecker.check,
    authMode: "error",
    validate: false,
  });

  const server = new ApolloServer({ schema });

  await server.start();

  const app = express();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  app.listen({ port: 3000 }, () =>
    console.log(`Server ready at http://localhost:3000`)
  );
};

startServer().catch((err) => console.error(err));
