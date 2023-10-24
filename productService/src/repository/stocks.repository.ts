import { IStock } from "@/models/stock.model";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TableName = "Stocks";

export const findStocks = async () => {
  const stocks = await dynamo.send(
    new ScanCommand({ TableName })
  )

  return stocks.Items as IStock[]
}

export const findStockById = async (productId: string) => {
  const stock = await dynamo.send(
    new GetCommand({
      TableName,
      Key: {
        productId
      }
    })
  )

  return stock.Item as IStock
}
