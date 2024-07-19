import { MiddlewareFn } from "type-graphql";

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;

  if (info.parentType.name === "Mutation" || info.parentType.name === "Query") {
    console.log(
      `${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`
    );
  }
};
