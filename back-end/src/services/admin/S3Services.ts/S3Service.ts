import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { IS3Service } from "../../../interfaces/S3/IS3Service";
import dotenv from 'dotenv'
import FileType from 'file-type';

dotenv.config()


export class S3Service implements IS3Service {
    private s3: S3Client;
    private bucketName: string;

    constructor() {
        const region = process.env.BUCKET_REGION;
        const accessKeyId = process.env.ACCESS_KEY;
        const secretAccessKey = process.env.SECRET_ACCESS_KEY;
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

        this.bucketName = process.env.AWS_BUCKET_NAME;
    }

    // Upload file to S3
    async uploadFile(file: Buffer, fileName: string): Promise<string> {
        console.log('upload file invoked',file,fileName)
        try {
            // Determine the Content-Type dynamically
            const fileType = await FileType.fromBuffer(file);
            const contentType = fileType?.mime || 'application/octet-stream'

            const uploadParams = {
                Bucket: this.bucketName,
                Key: fileName,
                Body: file,
                ContentType: contentType, 
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
