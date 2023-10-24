import { middyfy } from '@/libs/lambda';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCode } from '@/constants/statusCode';
import { Headers } from '@/constants/headers';
import { getProducts } from '@/services/product.service';
import { getStocks } from '@/services/stock.service';
import { ResponseMessage } from '@/constants/responseMessage';

const getProductsList: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const stocks = await getStocks()
    const products = await getProducts(stocks)

    return {
      statusCode: StatusCode.SUCCESS,
      body: JSON.stringify(products),
      headers: { ...Headers}
    }
  } catch {
    return ({
      body: ResponseMessage.INTERNAL_ERROR,
      statusCode: StatusCode.INTERNAL_ERROR
    })
  }
};

export const main = middyfy(getProductsList);