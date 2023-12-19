#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StorageStack } from '../stacks/StorageStack';
import { DistributionStack } from '../stacks/DistributionStack';
import * as PROJECTS from '../projects';

const app = new cdk.App();

for (const project of Object.values(PROJECTS)) {
    for (const account of project.accounts) {
        const storageStack = new StorageStack(app, `${project.name}-${account.id}`);

        for (const environment of account.environments) {
            new DistributionStack(app, `${project.name}-${account.id}-${environment.name}`, {
                path: environment.path,
                bucket: storageStack.bucket,
                optimal: environment.optimal,
                variables: environment.variables,
            });
        }
    }
}
