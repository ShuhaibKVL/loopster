import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { IS3Service } from "../../../interfaces/S3/IS3Service";
import dotenv from 'dotenv'

dotenv.config()


export class S3Service implements IS3Service {
    private s3: S3Client;
    private bucketName: string;

    constructor() {
        console.log('AWS_REGION:', process.env.BUCKET_REGION);
        console.log('AWS_ACCESS_KEY_ID:', process.env.ACCESS_KEY);
        console.log('AWS_SECRET_ACCESS_KEY:', process.env.SECRET_ACCESS_KEY);
        console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);
        const region = process.env.BUCKET_REGION;
        const accessKeyId = process.env.ACCESS_KEY;
        const secretAccessKey = process.env.SECRET_ACCESS_KEY;

        console.log('inside S3Service :region :',region,"accessKey :",accessKeyId,"secretKey :",secretAccessKey)

        // Check if any required environment variable is undefined
        if (!region || !accessKeyId || !secretAccessKey || !process.env.AWS_BUCKET_NAME) {
            throw new Error('AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_BUCKET_NAME must be set in the environment variables');
        }

        this.s3 = new S3Client({
            region: region,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });

        this.bucketName = process.env.AWS_BUCKET_NAME; // S3 bucket name
    }

    // Upload file to S3
    async uploadFile(file: Buffer, fileName: string): Promise<string> {
        console.log('upload file invoked',file,fileName)
        try {
            const uploadParams = {
                Bucket: this.bucketName,
                Key: fileName,
                Body: file,
                ContentType: 'image/png', // Example content type; this could be dynamic
            };
    
            const command = new PutObjectCommand(uploadParams);
            console.log('command :',command)
            await this.s3.send(command);
    
            // Construct the URL for the uploaded file
            return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
        } catch (error:any) {
            console.log('error on uploadFile :',error)
            return error.message
        }
        
    }

    async deleteFile(key: string): Promise<void> {
        const deleteParams = {
            Bucket: this.bucketName,
            Key: key,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await this.s3.send(command);
    }
}
