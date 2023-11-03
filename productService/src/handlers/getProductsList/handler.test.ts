import {  Context } from "aws-lambda"
import { main } from "./handler"
import { StatusCode } from "@/constants/statusCode"
import { getStocks } from "@/services/stock.service"
import { getProducts } from "@/services/product.service"

const mockEvent = {
  httpMethod: 'GET',
  path: `/products`,
  headers: {},
  multiValueHeaders: {},
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {},
  body: '',
  rawBody: '',
  resource: '/',
  isBase64Encoded: false,
}

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

jest.mock('@/libs/lambda', () => ({
  middyfy: jest.fn((f) => f)
}))

jest.mock('@/services/stock.service', () => ({
  getStocks: jest.fn(() => [mockStock])
}))

jest.mock('@/services/product.service', () => ({
  getProducts: jest.fn(() => [mockProduct])
}))

describe('Handler: getProductsList', () => {
  it('should call getStocks and getProducts service methods when call main method', async () => {
    await main(mockEvent, {} as Context)

    expect(getStocks).nthCalledWith(1)
    expect(getProducts).nthCalledWith(1, [mockStock])
  })

  it('should return correct response if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.body).toEqual(JSON.stringify([mockProduct]))
  })

  it('should return correct status code if passed correct id when call main method', async () => {
    const response = await main(mockEvent, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.SUCCESS)
  })
})
