import { middyfy } from '@/libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda';
import { Products } from '@/database/products'
import { HttpError } from '@/constants/httpError';
import { StatusCode } from '@/constants/statusCode';
import { ResponseMessage } from '@/constants/responseMessage';
import { Headers } from '@/constants/headers';

const getProductById: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id
    const product = Products.find((product) => product.id === id)

    if (!product) {
      throw new HttpError(
        StatusCode.NOT_FOUND,
        ResponseMessage.NOT_FOUND
      )
    }

    return {
      statusCode: StatusCode.SUCCESS,
      body: JSON.stringify(product),
      headers: { ...Headers}
    }
  } catch (err: any) {
    if(err instanceof HttpError) {
      return {
        body: err.message,
        statusCode: err.statusCode
      }
    }

    return ({
      body: ResponseMessage.INTERNAL_ERROR,
      statusCode: StatusCode.INTERNAL_ERROR
    })
  }
};

export const main = middyfy(getProductById);
