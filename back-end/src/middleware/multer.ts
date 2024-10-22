import multer from 'multer';
// Configure multer to store files in memory (since we'll upload to S3)
const storage = multer.memoryStorage();
console.log('>>>>')
const upload = multer({ storage });
console.log('<<<<')

export default upload;
