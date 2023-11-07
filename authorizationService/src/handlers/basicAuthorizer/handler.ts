import { middyfy } from '@/libs/lambda';
import { HttpError } from '@/constants/httpError';
import { ResponseMessage } from '@/constants/responseMessage';
import { StatusCode } from '@/constants/statusCode';
import { MyAPIGatewayProxyEvent } from '@/libs/api-gateway';
import { configDotenv } from "dotenv";

configDotenv()

const basicAuthorizer = (event: MyAPIGatewayProxyEvent) => {
  const arn = event.methodArn

  try {
    const token = event.authorizationToken

    if (!token) {
      throw new HttpError(
        StatusCode.UNAUTHORIZED,
        ResponseMessage.NO_TOKEN
      )
    }

    const [, creds] = token.split(' ');
    
    if (!creds) {
      throw new HttpError(
        StatusCode.UNAUTHORIZED,
        ResponseMessage.INVALID_CREDS
      )
    }

    const credentials = Buffer.from(creds, 'base64').toString().split(':');
    const login = credentials[0];
    const password = credentials[1];
    const expectedPassword = process.env[login];
    
    if (!expectedPassword || password !== expectedPassword) {
      return generatePolicy(login, 'Deny', arn)
    }

    return  generatePolicy(login, 'Allow', arn)

  } catch (err: any) {
    console.log('___ERROR___', err)
    
    if(err instanceof HttpError) {
      return 'Unauthorized'
    }

    return 'Internal error'
  }
};

const generatePolicy = (login: string, access: string, arn: string) => ({
  principalId: login,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: access,
        Resource: arn
      }
    ]
  }
})

export const main = middyfy(basicAuthorizer);
