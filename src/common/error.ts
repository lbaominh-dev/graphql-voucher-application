import { MiddlewareFn } from "type-graphql";

export const ErrorInterceptor: MiddlewareFn<any> = async (
  { context, info },
  next
) => {
  try {
    return await next();
  } catch (err) {
    // Write error to file log
    console.error(err);

    // Rethrow the error
    throw err;
  }
};
