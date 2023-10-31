import { middyfy } from '@/libs/lambda';
import { SQSEvent } from 'aws-lambda';
import { StatusCode } from '@/constants/statusCode';
import { ResponseMessage } from '@/constants/responseMessage';
import { IRequestProduct } from '@/models/product.model';
import { createNewProduct } from '@/services/product.service';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const sns = new SNSClient({ region: 'eu-west-1' })

const catalogBatchProcess = async ( event: SQSEvent ) => {
  try {
    const records = event.Records

    for(let i = 0;i < records.length; i++) {
      const command = new PublishCommand({
        Message: JSON.stringify(records[i]),
        TopicArn: process.env.SNS_URL
      })

      await createNewProduct(records[i].body as unknown as IRequestProduct)

      await sns.send(command)
    }

  } catch (err: any) {
    return ({
      body: ResponseMessage.INTERNAL_ERROR + err.message,
      statusCode: StatusCode.INTERNAL_ERROR,
    })
  }
};

export const main = middyfy(catalogBatchProcess);
