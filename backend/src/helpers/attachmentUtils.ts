import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3(),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    ) { }

    async getSignedUrl(todoId): Promise<string> {
        const url = this.s3.getSignedUrl('getObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: this.urlExpiration
        })

        return url
    }
}