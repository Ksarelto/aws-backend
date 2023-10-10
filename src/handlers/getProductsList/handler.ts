import { middyfy } from '@/libs/lambda';
import { Products} from '@/database/products'
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCode } from '@/constants/statusCode';
import { Headers } from '@/constants/headers';

const getProductsList: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: StatusCode.SUCCESS,
    body: JSON.stringify(Products),
    headers: { ...Headers}
  }
};

export const main = middyfy(getProductsList);
