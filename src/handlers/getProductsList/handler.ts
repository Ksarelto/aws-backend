import { middyfy } from '@/libs/lambda';
import { Products} from '@/database/products'
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const getProductsList: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(Products)
  }
};

export const main = middyfy(getProductsList);
