const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Configuration = {
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
  },
  region: process.env.S3_REGION,
};
const s3Client = new S3Client(s3Configuration);

const time30minutes = 30 * 60;

module.exports.getSignedAwsS3Url = async (bucket, key) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: time30minutes,
  });
  console.log(presignedUrl);
  return presignedUrl;
};
