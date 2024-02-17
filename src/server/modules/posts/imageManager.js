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
    const paresedFilename = filename.split('.')[0];
    const formattedFilename = `formatted+${paresedFilename}.webp`;
    const imageInfo = await sharp(img.filepath).metadata();

    await sharp(img.filepath).toFormat('webp').toFile(`${formattedFilename}`);

    let uploadParams = {
      Bucket: process.env.S3_AWS_BUCKET_NAME,
      Key: `${filename}.webp`,
      Body: '',
    };
    let fileStream = fs.createReadStream(`${formattedFilename}`);
    fileStream.on('error', function (err) {
      console.log('File Error', err);
    });

    uploadParams.Body = fileStream;
    uploadParams.ContentType = img.mimetype;
    const result = await s3.upload(uploadParams).promise();
    fs.unlinkSync(`${formattedFilename}`);

    return { width: imageInfo.width, height: imageInfo.height, url: result.Location };
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
