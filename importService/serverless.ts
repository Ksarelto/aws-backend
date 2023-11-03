import type { AWS } from '@serverless/typescript';
import { importProductParser, importProductsFile } from '@/handlers'
import { configDotenv } from "dotenv";

configDotenv()

const BUCKET_NAME = process.env.BUCKET_NAME as string
const REGION = process.env.REGION as string
const SERVICE_NAME = process.env.SERVICE_NAME as string
const SQS_URL = process.env.SQS_URL as string

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
      SQS_URL: SQS_URL
    },
    region: REGION as any,
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
            "s3:ListBucket"
        ],
        Resource: [
            `arn:aws:s3:::${BUCKET_NAME}`
        ]
      },
      {
          Effect: "Allow",
          Action: [
              "s3:GetObject",
              "s3:PutObject",
              "s3:PutObjectTagging",
              "s3:GetObjectTagging",
              "s3:DeleteObject"
          ],
          Resource: [
              `arn:aws:s3:::${BUCKET_NAME}/*`
          ]
      }
    ]
  },
  functions: { importProductsFile, importProductParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
