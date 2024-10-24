import multer from 'multer';
// Configure multer to store files in memory (since we'll upload to S3)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
