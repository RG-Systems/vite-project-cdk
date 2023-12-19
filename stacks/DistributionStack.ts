import type { Construct } from 'constructs';
import type { Bucket } from 'aws-cdk-lib/aws-s3';

import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

type Props = cdk.StackProps & {
    path: string;
    bucket: Bucket;
    optimal: boolean;
    variables?: Record<string, string>;
};

export class DistributionStack extends cdk.Stack {
    constructor(scope: Construct, id: string, { bucket, path, optimal, variables, ...props }: Props) {
        super(scope, id, props);

        new cloudfront.Distribution(this, id, {
            priceClass: optimal ? cloudfront.PriceClass.PRICE_CLASS_ALL : cloudfront.PriceClass.PRICE_CLASS_100,
            defaultRootObject: `index.html`,
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: `/index.html`,
                },
            ],
            defaultBehavior: {
                origin: new origins.S3Origin(bucket, { originPath: path }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                functionAssociations: [
                    {
                        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                        function: new cloudfront.Function(this, `${id}-env`, {
                            code: cloudfront.FunctionCode.fromInline(`
                                function handler(event) {
                                    if (!event.request.uri.endsWith('/env.json')) return event.request;

                                    return {
                                        statusCode: 200,
                                        statusDescription: 'OK',
                                        headers: {
                                            'content-type': {
                                                value: 'application/json;charset=UTF-8',
                                            },
                                        },
                                        body: JSON.stringify(${JSON.stringify(variables)}),
                                    };
                                }
                            `),
                        }),
                    }
                ],
            },
        });
    }
}
