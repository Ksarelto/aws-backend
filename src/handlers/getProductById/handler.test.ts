import {  Context } from "aws-lambda"
import { main } from "./handler"
import { StatusCode } from "@/constants/statusCode"
import { getStock } from "@/services/stock.service"
import { getProduct } from "@/services/product.service"
import { HttpError } from "@/constants/httpError"
import { ResponseMessage } from "@/constants/responseMessage"

const mockProduct = {
  description: "Cool fast car",
  id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
  price: 24000,
  title: "Mini Cooper",
  imageUrl: "https://i.ibb.co/Tv1yz2B/mini-cooper.jpg"
}

const mockStock = {
  productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
  count: 2
}

const mockId = mockProduct.id

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

jest.mock('@/services/product.service', () => ({
  getProduct: jest.fn(() => mockProduct)
}))

jest.mock('@/services/stock.service', () => ({
  getStock: jest.fn(() => mockStock)
}))

describe('Handler: getProductById', () => {
  it('should call getProduct and getStock service methods when call main method', async () => {
    await main(mockEvent, {} as Context)

    expect(getStock).nthCalledWith(1, mockProduct.id)
    expect(getProduct).nthCalledWith(1, mockProduct.id, mockStock.count)
  })

  it('should return correct response if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.body).toEqual(JSON.stringify(mockProduct))
  })

  it('should return correct status code if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.SUCCESS)
  })

  it('should return correct status code if if internal error appears', async () => {
    (getProduct as jest.Mock).mockImplementationOnce(() => Promise.reject())

    const response = await main(mockEvent, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.INTERNAL_ERROR)
  })

  it('should return correct status code if if Http error is thrown', async () => {
    (getProduct as jest.Mock).mockImplementationOnce(() => Promise.reject(
      new HttpError(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND)
    ))

    const response = await main(mockEvent, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.NOT_FOUND)
  })
})
