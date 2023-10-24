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
import { IRequestProduct } from '@/models/product.model';
import { createNewProduct } from '@/services/product.service';
import { productRequestSchema } from '@/schemas/product.schema';

const createProduct: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body as unknown as IRequestProduct
    const validationResult = productRequestSchema.validate(body)

    if (validationResult.error?.message) {
      throw new HttpError(
        StatusCode.BAD_REQUEST,
        validationResult.error.message
      )
    }

    const createdProduct = await createNewProduct(body)

    return {
      statusCode: StatusCode.SUCCESS,
      body: JSON.stringify(createdProduct),
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
      body: ResponseMessage.INTERNAL_ERROR + err.message,
      statusCode: StatusCode.INTERNAL_ERROR,
    })
  }
};

export const main = middyfy(createProduct);
