import { middyfy } from '@/libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Headers } from '@/constants/headers';
import { HttpError } from '@/constants/httpError';
import { ResponseMessage } from '@/constants/responseMessage';
import { StatusCode } from '@/constants/statusCode';

const s3 = new S3Client({ region: 'eu-west-1'})

const importProductsFile: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const name = event.queryStringParameters?.name

    if(!name) {
      throw new HttpError(
        StatusCode.BAD_REQUEST,
        ResponseMessage.FILE_NAME
      )
    }

    const putCommand = new PutObjectCommand({
      Bucket: 'products-files-aws-course',
      Key: `uploaded/${name}`,
    })
    
    const signedUrl = await getSignedUrl(s3, putCommand, {
      expiresIn: 5000
    })

    return {
      statusCode: StatusCode.SUCCESS,
      body: JSON.stringify(signedUrl),
      headers: {...Headers}
    }
  } catch (err: any) {
    if(err instanceof HttpError) {
      return {
        body: err.message,
        statusCode: err.statusCode
      }
    }

    return ({
      body: ResponseMessage.INTERNAL_ERROR + err.message,
      statusCode: StatusCode.INTERNAL_ERROR,
    })
  }
};

export const main = middyfy(importProductsFile);
