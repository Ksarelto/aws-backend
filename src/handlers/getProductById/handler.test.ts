import {  Context } from "aws-lambda"
import { main } from "./handler"
import { Products } from "@/database/products"
import { StatusCode } from "@/constants/statusCode"

const mockId = Products[0].id

const mockEvent = {
  httpMethod: 'GET',
  path: `/products/${mockId}`,
  headers: {},
  multiValueHeaders: {},
  pathParameters: {
    id: mockId
  },
  multiValueQueryStringParameters: null,
  queryStringParameters: null,
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

describe('Handler: getProductById', () => {
  it('should return correct response if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.body).toEqual(JSON.stringify(Products[0]))
  })

  it('should return correct status code if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.SUCCESS)
  })

  it('should return correct status code if if product not found', async () => {
    const eventCopy = {
      ...mockEvent,
      queryStringParameters: {
        id: 'test'
      }
    }

    const response = await main(eventCopy, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.NOT_FOUND)
  })
})
