import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId:process.env.ACCESS_KEY,
    secretAccessKey:process.env.SECRET_ACCESS_KEY,
    region:process.env.BUCKET_REGION
});

const s3 = new AWS.S3();
