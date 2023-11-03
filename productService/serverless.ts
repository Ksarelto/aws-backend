import type { AWS } from '@serverless/typescript';
import getProductsList from '@/handlers/getProductsList';
import getProductById from '@/handlers/getProductById';
import createProduct from '@/handlers/createProduct';
import catalogBatchProcess from '@/handlers/catalogBatchProcess';
import { configDotenv } from "dotenv";

configDotenv()

const REGION = process.env.REGION as string
const SERVICE_NAME = process.env.SERVICE_NAME as string
const PRODUCTS_TABLE_ARN = process.env.PRODUCTS_TABLE_ARN as string
const STOCKS_TABLE_ARN = process.env.STOCKS_TABLE_ARN as string
const QUEUE_ARN = process.env.QUEUE_ARN as string
const WITHOUT_FILTERS_EMAIL = process.env.WITHOUT_FILTERS_EMAIL as string
const WITH_FILTERS_EMAIL = process.env.WITH_FILTERS_EMAIL as string

const serverlessConfiguration: AWS = {
  service: SERVICE_NAME,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_URL: {
        Ref: 'CatalogItemsQueue'
      },
      SNS_URL: {
        Ref: 'ProductTopic'
      }
    },
    region: REGION as any,
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: PRODUCTS_TABLE_ARN
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: STOCKS_TABLE_ARN
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: QUEUE_ARN
          },
          {
            Effect: 'Allow',
            Action: 'sns:*',
            Resource: {
              Ref: 'ProductTopic'
            }
          }
        ]
      }
    }
  },
  resources: {
    Resources: {
      Products: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Products',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      Stocks: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Stocks',
          AttributeDefinitions: [
            {
              AttributeName: 'productId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'productId',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      ProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'ProductTopic',
          TopicName: 'productTopic',
        },
      },
      EmailSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          TopicArn: { Ref: 'ProductTopic' },
          Endpoint: WITHOUT_FILTERS_EMAIL,
        }, 
      },
      EmailPriceSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          TopicArn: { Ref: 'ProductTopic' },
          Endpoint: WITH_FILTERS_EMAIL,
          FilterPolicy: {
            count: [{
              numeric: ['<', 10000]
            }]
          }
        }
      }
    }
  },
  functions: {
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
