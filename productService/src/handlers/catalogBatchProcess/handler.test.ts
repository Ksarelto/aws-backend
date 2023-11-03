import {  Context } from "aws-lambda"
import { main } from "./handler"
import { StatusCode } from "@/constants/statusCode"
import { createNewProduct } from "@/services/product.service"
import { ResponseMessage } from "@/constants/responseMessage"

const mockProduct = `{
  "description": "Cool fast car",
  "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
  "price": 24000,
  "title": "Mini Cooper",
  "imageUrl": "https://i.ibb.co/Tv1yz2B/mini-cooper.jpg"
}`

const mockCallback = jest.fn()

const mockEvent: any = {
  Records: [{
    body: mockProduct
  }]
}

jest.mock('@middy/core', () => ({
  __esModule: true,
  default: (f) => f
}))

jest.mock('@aws-sdk/client-sns', () => ({
  SNSClient: function() {
    this.send = jest.fn(() => mockCallback())
  },
  PublishCommand: function() {}
}))

jest.mock('@/services/product.service', () => ({
  createNewProduct: jest.fn(() => Promise.resolve(mockProduct))
}))

describe('Handler: catalogBatchProcess', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call createNewProduct when call catalogBatchProcess', async () => {
    await main(mockEvent, {} as Context)

    expect(createNewProduct).nthCalledWith(1, JSON.parse(mockProduct))
  })

  it('should send product with sns when call catalogBatchProcess', async () => {
    await main(mockEvent, {} as Context)

    expect(mockCallback).toHaveBeenCalledTimes(mockEvent.Records.length)
  })

  it('should return internal error response if something go wrong', async () => {
    const errorMessage = 'error';
    (createNewProduct as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error(errorMessage)))

    const response = await main(mockEvent, {} as Context)

    expect(response.statusCode).toEqual(StatusCode.INTERNAL_ERROR)
    expect(response.body).toEqual(ResponseMessage.INTERNAL_ERROR + errorMessage)
  })
})
