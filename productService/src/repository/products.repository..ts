import { IProduct, IResponseProduct } from "@/models/product.model";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TableName = "Products";

export const findProducts = async () => {
  const products = await dynamo.send(
    new ScanCommand({ TableName })
  )

  return products.Items as IProduct[]
}

export const findProductById = async (id: string) => {
  const product = await dynamo.send(
    new GetCommand({
      TableName,
      Key: {
        id
      }
    })
  )

  return product.Item as IProduct
}

export const addProduct = async (product: IResponseProduct) => {
  const { count, id, ...rest} = product
  const response = await dynamo.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: 'Products',
            Item: {
              ...rest,
              id
            },
            ConditionExpression: 'attribute_not_exists(id)'
          }
        },
        {
          Put: {
            TableName: 'Stocks',
            Item: {
              productId: id,
              count: count
            },
            ConditionExpression: 'attribute_not_exists(productId)'
          }
        }
      ]
    })
  )

  console.log(response)

  return product
}