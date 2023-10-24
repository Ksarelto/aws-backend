import {  Context } from "aws-lambda"
import { main } from "./handler"
import { StatusCode } from "@/constants/statusCode"

const mockProduct = {
  "description": "Cool fast car",
  "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
  "price": 24000,
  "title": "Mini Cooper",
  "imageUrl": "https://i.ibb.co/Tv1yz2B/mini-cooper.jpg"
}

const mockEvent = {
  httpMethod: 'POST',
  path: `/products`,
  headers: {},
  multiValueHeaders: {},
  pathParameters: {},
  multiValueQueryStringParameters: null,
  queryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  body: mockProduct,
  rawBody: '',
  resource: '/',
  isBase64Encoded: false,
}

const mockError = {
  error: {
    message: ''
  }
}

jest.mock('@/libs/lambda', () => ({
  middyfy: jest.fn((f) => f)
}))

jest.mock('joi', () => ({
  __esModule: true,
  default: {
    object: jest.fn(() => ({
      validate: jest.fn(() => mockError)
    })),
    string: jest.fn(function() { return this }),
    number: jest.fn(function() { return this }),
    required: jest.fn()
  },
}))

jest.mock('@/services/product.service', () => ({
  createNewProduct: jest.fn(() => Promise.resolve(mockProduct))
}))

describe('Handler: createProduct', () => {
  it('should return correct response if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.body).toEqual(JSON.stringify(mockProduct))
  })

  it('should return correct status code if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.SUCCESS)
  })

  it('should return correct status code if if product body is not valid', async () => {
    mockError.error.message = 'errorMessage'

    const response = await main(mockEvent, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.BAD_REQUEST)
  })
})
