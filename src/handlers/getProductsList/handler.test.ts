import {  Context } from "aws-lambda"
import { main } from "./handler"
import { Products } from "@/database/products"
import { StatusCode } from "@/constants/statusCode"

const mockEvent = {
  httpMethod: 'GET',
  path: `/products`,
  headers: {},
  multiValueHeaders: {},
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  body: '',
  rawBody: '',
  resource: '/',
  isBase64Encoded: false,
}

jest.mock('@/libs/lambda', () => ({
  middyfy: jest.fn((f) => f)
}))

describe('Handler: getProductsList', () => {
  it('should return correct response if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.body).toEqual(JSON.stringify(Products))
  })

  it('should return correct status code if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.SUCCESS)
  })
})
