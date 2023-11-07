import type { AWS } from '@serverless/typescript';
import { importProductParser, importProductsFile } from '@/handlers'
import { configDotenv } from "dotenv";

configDotenv()

const serverlessConfiguration: AWS = {
  service: process.env.SERVICE_NAME,
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin'
  ],
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
      SQS_URL: process.env.SQS_URL
    },
    region: process.env.REGION as any,
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
            "s3:ListBucket"
        ],
        Resource: [
            `arn:aws:s3:::${process.env.BUCKET_NAME}`
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
              `arn:aws:s3:::${process.env.BUCKET_NAME}/*`
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
