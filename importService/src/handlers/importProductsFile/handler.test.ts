import { createReadStream } from "fs"
import { main } from "./handler"
import { ResponseMessage } from "@/constants/responseMessage"
import { StatusCode } from "@/constants/statusCode"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const mockEvent = {
  queryStringParameters: {
    name: 'test'
  },
}

const mockUrl = 'mockUrl'

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(() => mockUrl)
}))

jest.mock('@/libs/lambda', () => ({
  middyfy: jest.fn((f) => f)
}))

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: function() {
    this.send = jest.fn(() => (
      Promise.resolve({
        Body: createReadStream('src/handlers/importProductsFile/test.txt')
      })
    ))
  },
  PutObjectCommand: function() {}
}))

describe('Handlers: importProductsFile', () => {

  beforeEach(() => {
    mockEvent.queryStringParameters.name = 'test'
  })

  it('should return an appropriate status code and message if name is not provided', async () => {
    mockEvent.queryStringParameters.name = ''

    const res = await main(mockEvent as any, null)

    expect(res.body).toBe(ResponseMessage.FILE_NAME)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
  })

  it('should return an appropriate status code and message if got internal error', async () => {
    const errMessage = 'test';
    (getSignedUrl as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error(errMessage)));
    const res = await main(mockEvent as any, null);

    expect(res.body).toBe(ResponseMessage.INTERNAL_ERROR + errMessage);
    expect(res.statusCode).toBe(StatusCode.INTERNAL_ERROR);
  })

  it('should return an correct url and status code if no errors occurs', async () => {
    const res = await main(mockEvent as any, null)

    expect(res.body).toBe(JSON.stringify(mockUrl))
    expect(res.statusCode).toBe(StatusCode.SUCCESS)
  })
})