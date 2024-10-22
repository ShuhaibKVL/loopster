import AWS from 'aws-sdk'
// Configure AWS with your access and secret key.
AWS.config.update({
    accessKeyId:process.env.ACCESS_KEY, //'YOUR_ACCESS_KEY_ID',
    secretAccessKey:process.env.SECRET_ACCESS_KEY, //'YOUR_SECRET_ACCESS_KEY',
    region:process.env.BUCKET_REGION  // e.g., 'us-east-1'
});

const s3 = new AWS.S3();
