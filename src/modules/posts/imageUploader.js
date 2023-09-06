import aws from 'aws-sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function imageUploader(img) {
  const filename = `${Date.now()}_${img.originalFilename}`;
  let uploadParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: filename, Body: '' };
  let fileStream = fs.createReadStream(img.filepath);
  fileStream.on('error', function (err) {
    console.log('File Error', err);
  });

  uploadParams.Body = fileStream;
  uploadParams.ContentType = img.mimetype;
  // deleteFile(img);
  const result = await s3.upload(uploadParams).promise();
  return result.Location;
}

export default imageUploader;
