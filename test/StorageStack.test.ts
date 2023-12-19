import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StorageStack } from '../stacks/StorageStack';

test('StorageStack creates an S3 bucket', () => {
    const app = new App();
    const stack = new StorageStack(app, 'test-bucket');

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: 'test-bucket-storage',
        PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true
        },
        AccessControl: 'Private',
    });
});

test('StorageStack has a bucket property', () => {
    const app = new App();
    const stack = new StorageStack(app, 'test-bucket');

    expect(stack.bucket).toBeDefined();
});