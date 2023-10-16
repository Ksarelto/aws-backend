import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const Products = [
  {
    "description": "Cool fast car",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "price": 24000,
    "title": "Mini Cooper",
    "imageUrl": "https://i.ibb.co/Tv1yz2B/mini-cooper.jpg"
  },
  {
    "description": "Short Product Description3",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    "price": 75000,
    "title": "Tesla model S",
    "imageUrl": "https://i.ibb.co/jW4K8GZ/tesla-model-s.jpg"
  },
  {
    "description": "Short Product Description2",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
    "price": 150000,
    "title": "Lamborghini hurricane",
    "imageUrl": "https://i.ibb.co/pvLfkFg/lamborgini-huracan.jpg"
  },
  {
    "description": "Short Product Description7",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    "price": 80000,
    "title": "Porsche 911",
    "imageUrl": "https://i.ibb.co/xhDxq31/porsche-911.jpg"
  },
  {
    "description": "Short Product Description2",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    "price": 130000,
    "title": "Corvette C6",
    "imageUrl": "https://i.ibb.co/2dvDbzG/corvette-c6.jpg"
  },
  {
    "description": "Short Product Description4",
    "id": "7567ec4b-b10c-48c5-9345-fc73348a80a1",
    "price": 101000,
    "title": "Mercedes SL Roadster",
    "imageUrl": "https://i.ibb.co/pz41B5J/mercedes-sl-roadster.jpg"
  },
  {
    "description": "Short Product Descriptio1",
    "id": "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
    "price": 94_000,
    "title": "Chevrolet Camaro",
    "imageUrl": "https://i.ibb.co/5YFTXLP/chevrolet-camaro.jpg"
  },
  {
    "description": "Short Product Description7",
    "id": "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
    "price": 55000,
    "title": "Renault megan electric",
    "imageUrl": "https://i.ibb.co/0rSKnwG/renault-megane-electric.jpg"
  }
]
const Stocks = [
  {
    "productId" : "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "count": 4
  },
  {
    "productId" : "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    "count": 6
  },
  {
    "productId" : "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
    "count": 7
  },
  {
    "productId" : "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    "count": 12
  },
  {
    "productId" : "7567ec4b-b10c-48c5-9345-fc73348a80a1",
    "count": 8
  },
  {
    "productId" : "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    "count": 7
  },
  {
    "productId" : "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
    "count": 2
  },
  {
    "productId" : "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
    "count": 3
  },
]

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const clearTables = async () => {
  const products = await dynamo.send(new ScanCommand({
    TableName: 'Products'
  }))
  const stocks = await dynamo.send(new ScanCommand({
    TableName: 'Stocks'
  }))

  const deleteProductsRequests = []
  const deleteStocksRequests = []

  for (let i = 0;i < products.Items.length; i++) {
    deleteProductsRequests.push({
      DeleteRequest: {
        Key: { id: products.Items[i].id.S }
      }
    })

    deleteStocksRequests.push({
      DeleteRequest: {
        Key: { productId: stocks.Items[i].productId.S }
      }
    })
  }
  
  await dynamo.send(
    new BatchWriteCommand({
      RequestItems: {
        Products: deleteProductsRequests,
        Stocks: deleteStocksRequests
      }
    })
  )
}

const fillTables = async () => {
  const productsRequests = []
  const stocksRequests = []

  for (let i = 0; i < Products.length; i++) {
    productsRequests.push({
      PutRequest: {
        Item: Products[i]
      }
    })

    stocksRequests.push({
      PutRequest: {
        Item: Stocks[i]
      }
    })
  }

  await dynamo.send(
    new BatchWriteCommand({
      RequestItems: {
        Products: productsRequests,
        Stocks: stocksRequests
      }
    })
  )
}

const resetTables = async () => {
  await clearTables()
  await fillTables()
}

resetTables()