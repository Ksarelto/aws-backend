import { handlerPath } from '@/libs/handler-resolver';
import { configDotenv } from "dotenv";

configDotenv()

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: {
          name: 'import-authorizer',
          arn: `arn:aws:lambda:${process.env.REGION}:${process.env.ACCOUNT_ID}:function:aws-authorizer-dev-basicAuthorizer`,
          identitySource: 'method.request.header.Authorization',
          type: 'token'
        },
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        }
      },
    },
  ],
};
