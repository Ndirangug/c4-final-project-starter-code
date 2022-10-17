import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)



export class AttachmentUtils {
    constructor(
        // private readonly s3 = createS3Bucket(),
        // private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        // private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    ) { }

    async uploadTodoImage(_todoId: string): Promise<string> {
        // const url = this.s3.getSignedUrl('putObject', {
        //     Bucket: this.bucketName,
        //     Key: todoId,
        //     Expires: this.urlExpiration
        // })

        return undefined
    }
}