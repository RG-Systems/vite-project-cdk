import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StorageStack } from '../stacks/StorageStack';
import { DistributionStack } from '../stacks/DistributionStack';
import { PriceClass } from 'aws-cdk-lib/aws-cloudfront';

test('DistributionStack creates a CloudFront distribution', () => {
    const app = new App();
    const bucket = new StorageStack(app, 'test-bucket').bucket;
    const stack = new DistributionStack(app, 'test-stack', { bucket, path: '/test', priceClass: PriceClass.PRICE_CLASS_ALL });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: {
            DefaultRootObject: 'index.html',
            DefaultCacheBehavior: {
                ViewerProtocolPolicy: 'redirect-to-https',
                FunctionAssociations: [
                    {
                        EventType: 'viewer-request',
                    }
                ]
            },
            PriceClass: PriceClass.PRICE_CLASS_ALL,
            CustomErrorResponses: [
                {
                    ErrorCode: 404,
                    ResponseCode: 200,
                    ResponsePagePath: '/index.html'
                }
            ]
        }
    });
});

test('DistributionStack creates a CloudFront function', () => {
    const app = new App();
    const bucket = new StorageStack(app, 'test-bucket').bucket
    const stack = new DistributionStack(app, 'test-stack', { bucket, path: '/test', variables: { test: 'value' } });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::CloudFront::Function', {
        AutoPublish: true,
        FunctionConfig: {
            Runtime: 'cloudfront-js-1.0'
        }
    });
});
