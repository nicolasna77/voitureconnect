import * as Minio from "minio";
import { env } from "process";
import type internal from "stream";

// Create a new Minio client with the S3 endpoint, access key, and secret key
export const s3Client = new Minio.Client({
  endPoint: env.S3_ENDPOINT ?? throwError("S3_ENDPOINT is required"),
  port: env.S3_PORT ? Number(env.S3_PORT) : undefined,
  accessKey: env.S3_ACCESS_KEY ?? throwError("S3_ACCESS_KEY is required"),
  secretKey: env.S3_SECRET_KEY ?? throwError("S3_SECRET_KEY is required"),
  useSSL: env.S3_USE_SSL === "true",
});

export async function createBucketIfNotExists(bucketName: string) {
  const bucketExists = await s3Client.bucketExists(bucketName);
  if (!bucketExists) {
    await s3Client.makeBucket(bucketName);
  }
}

function throwError(message: string): never {
  throw new Error(message);
}
