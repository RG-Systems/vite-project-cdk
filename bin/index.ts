#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StorageStack } from '../stacks/StorageStack';
import { DistributionStack } from '../stacks/DistributionStack';
import { PriceClass } from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();

enum Env {
  QA = 'qa',
  PROD = 'prod',
};

const path = process.env.ORIGIN_PATH as string;
const tmp = process.env.TMP_ENV as Env;

const NAME = 'vite-project-ui';
const VARIABLES: Record<Env, Record<string, string>> = {
  qa: {
    'VITE_API_URL': 'https://qa-api.example.com',
  },
  prod: {
    'VITE_API_URL': 'https://api.example.com',
  },
};

const storageStack = new StorageStack(app, `${NAME}-storage`);

new DistributionStack(app, `${NAME}-env-qa`, {
  path,
  bucket: storageStack.bucket,
  priceClass: PriceClass.PRICE_CLASS_100,
  variables: VARIABLES.qa,
});

new DistributionStack(app, `${NAME}-env-prod`, {
  path,
  bucket: storageStack.bucket,
  priceClass: PriceClass.PRICE_CLASS_ALL,
  variables: VARIABLES.prod,
});

new DistributionStack(app, `${NAME}-env-tmp-${path}`, {
  path,
  bucket: storageStack.bucket,
  priceClass: PriceClass.PRICE_CLASS_100,
  variables: VARIABLES[tmp] || VARIABLES.qa,
});
