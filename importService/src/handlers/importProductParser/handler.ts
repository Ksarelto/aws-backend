import { S3Event } from 'aws-lambda';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import csv from 'csv-parser';
import { ResponseMessage } from '@/constants/responseMessage';
import { StatusCode } from '@/constants/statusCode';
import { Headers } from '@/constants/headers';
import middy from '@middy/core';

const s3 = new S3Client({ region: 'eu-west-1' })

const importProductParser = async ( event: S3Event ) => {
  try {
    const records = event.Records

    for (let record of records) {
      const { bucket, object } = record.s3;

      const getCommand = new GetObjectCommand({
        Bucket: bucket.name,
        Key: object.key
      })

      const response = await s3.send(getCommand)
      const stream = response.Body

      const data = []

      stream.pipe(csv())
      .on('data', (row) => {
        data.push(row)
      })
      .on('end', () => {
        console.log(`CSV file processing done: ${JSON.stringify(data)}`);

        const currentPath = object.key
        const newPath = object.key.replace('uploaded/', 'parsed/')

        updateBucket({
          bucketName: bucket.name,
          currentPath,
          newPath
        })
      })
    }

    return ({
      body: ResponseMessage.SUCCESS,
      statusCode: StatusCode.SUCCESS,
      headers: { ...Headers }
    })
  } catch(err) {
    return ({
        body: ResponseMessage.INTERNAL_ERROR + err.message,
        statusCode: StatusCode.INTERNAL_ERROR,
    })
  }
};

const updateBucket = async ({ bucketName, currentPath, newPath}) => {
  try{
    const copyObject = new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: `${bucketName}/${currentPath}`,
      Key: newPath
    })
  
    const deleteObject = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: currentPath
    })
    
    await s3.send(copyObject)
    await s3.send(deleteObject)

  } catch(err) {
    console.log(err)
  }
}

export const main = middy(importProductParser)
