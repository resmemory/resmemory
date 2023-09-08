import aws from 'aws-sdk';
import fs from 'fs';
import dotenv from 'dotenv';
import sharp from 'sharp';

dotenv.config();

let s3 = new aws.S3({
  accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_AWS_REGION,
});

async function imageUpload(img) {
  if (img.size == 0) {
    return null;
  } else {
    const filename = `${Date.now()}_${img.newFilename}`;
    const resizedFilename = `resized+${filename}`;

    await sharp(img.filepath)
      .resize({
        width: 600,
        height: 500,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toFile(`${resizedFilename}`);

    let uploadParams = { Bucket: process.env.S3_AWS_BUCKET_NAME, Key: filename, Body: '' };
    let fileStream = fs.createReadStream(`${resizedFilename}`);
    fileStream.on('error', function (err) {
      console.log('File Error', err);
    });

    uploadParams.Body = fileStream;
    uploadParams.ContentType = img.mimetype;
    const result = await s3.upload(uploadParams).promise();
    fs.unlinkSync(`${resizedFilename}`);

    return result.Location;
  }
}

async function imageDelete(key) {
  const params = {
    Bucket: process.env.S3_AWS_BUCKET_NAME,
    Key: key,
  };

  return await s3.deleteObject(params).promise();
}

export { imageUpload, imageDelete };
