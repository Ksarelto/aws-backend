import { middyfy } from '@/libs/lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda';
import { HttpError } from '@/constants/httpError';
import { StatusCode } from '@/constants/statusCode';
import { ResponseMessage } from '@/constants/responseMessage';
import { Headers } from '@/constants/headers';
import { getProduct } from '@/services/product.service';
import { getStock } from '@/services/stock.service';

const getProductById: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id
    const stock = await getStock(id)
    const product = await getProduct(id, stock.count)
    
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
