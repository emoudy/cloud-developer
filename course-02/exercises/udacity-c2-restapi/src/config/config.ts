export const config = {
  "dev": {
    "username": process.env.POSTGRESS_USERNAME,
    "password": process.env.POSTGRESS_PASSWORD,
    "database": process.env.POSTGRESS_DATABASE,
    "host": process.env.POSTGRESS_HOST,
    "dialect": "postgres",
    "aws_media_bucket": process.env.AWS_MEDIA_BUCKET,
    "aws_region": process.env.AWS_REGION,
    "aws_profile": process.env.AWS_PROFILE
  }
  // ,
  // "aws": {
  //   "aws_region": "us-east-2",
  //   "aws_profile": "default",
  //   "aws_media_bucket": "udagram-media-emoudy-dev"
  // },
  // "prod": {
  //   "username": "",
  //   "password": "",
  //   "database": "udagram_prod",
  //   "host": "",
  //   "dialect": "postgres"
  // }
}
