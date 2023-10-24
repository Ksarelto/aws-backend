import middy, { MiddlewareObj } from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

const loggerMiddleware = (): MiddlewareObj<any, any, Error, any> => ({
  before: ({ event, context}) => {
    console.log('\x1b[1;32m','Incoming request:\n', '\x1b[1;39m', JSON.stringify(event));
    console.log('\x1b[1;32m', 'Request arguments:\n', '\x1b[1;39m', JSON.stringify(context));
  }
});

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(loggerMiddleware())
}
