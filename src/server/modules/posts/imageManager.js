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
        height: null,
        fit: 'inside',
      })
      .webp({ quality: 80 })
      .toFile(`${resizedFilename}`);

    let uploadParams = { Bucket: process.env.S3_AWS_BUCKET_NAME, Key: filename, Body: '' };
    let fileStream = fs.createReadStream(`${resizedFilename}`);
    fileStream.on('error', function (err) {
      console.log('File Error', err);
    });

    uploadParams.Body = fileStream;
    uploadParams.ContentType = 'image/webp';
    const result = await s3.upload(uploadParams).promise();
    fs.unlinkSync(`${resizedFilename}`);

    return result.Location;
  }
}

async function imageThumbnail(img) {
  if (img.size == 0) {
    return null;
  } else {
    const filename = `${Date.now()}_${img.newFilename}`;
    const thumbnailFilename = `thumbnail+${filename}`;

    await sharp(img.filepath)
      .resize({
        width: 220,
        height: null,
        fit: 'inside',
      })
      .webp({ quality: 80 })
      .toFile(`${thumbnailFilename}`);

    let uploadParams = { Bucket: process.env.S3_AWS_BUCKET_NAME, Key: filename, Body: '' };
    let thumbnailStream = fs.createReadStream(`${thumbnailFilename}`);
    thumbnailStream.on('error', function (err) {
      console.log('Thumbnail Uploading Error', err);
    });

    uploadParams.Body = thumbnailStream;
    uploadParams.ContentType = 'image/webp';
    const thumbnail = await s3.upload(uploadParams).promise();
    fs.unlinkSync(`${thumbnailFilename}`);

    return thumbnail.Location;
  }
}

async function imageDelete(key) {
  const params = {
    Bucket: process.env.S3_AWS_BUCKET_NAME,
    Key: key,
  };

  return await s3.deleteObject(params).promise();
}

export { imageUpload, imageDelete, imageThumbnail };
