import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.S3_ENDPOINT?.startsWith("http")
  ? process.env.S3_ENDPOINT
  : `http://${process.env.S3_ENDPOINT}`;

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: endpoint,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: process.env.S3_USE_PATH_STYLE_ENDPOINT === "true",
});

const BUCKET_NAME = String(process.env.S3_BUCKET || "e-pkl");

async function ensureBucketExists() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    return { success: true };
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      console.log(`Bucket ${BUCKET_NAME} does not exist. Creating...`);
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`Bucket ${BUCKET_NAME} created successfully.`);
        return { success: true };
      } catch (createError) {
        console.error("Error creating bucket:", createError);
        return {
          success: false,
          error: "s3:bucket-create-failed",
          params: [{ bucket: BUCKET_NAME }],
        };
      }
    } else {
      console.error("Error checking bucket existence:", error);
      return {
        success: false,
        error: "s3:bucket-check-failed",
        params: [{ bucket: BUCKET_NAME }],
      };
    }
  }
}

export async function UploadFile(
  buffer,
  { ext = ".ext", original_name = "" } = {},
) {
  const bucketCheck = await ensureBucketExists();
  if (!bucketCheck.success) {
    return { error: bucketCheck.error, params: bucketCheck.params };
  }

  const id = crypto.randomUUID();
  const key = `file-${id}${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    Metadata: {
      "file-extension": ext,
      "original-name": original_name,
      "date-upload": new Date().toISOString(),
    },
  });

  try {
    await s3Client.send(command);
    return { id: key };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "s3:upload-failed" };
  }
}

export async function DeleteFile(id) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: id,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return { error: "s3:delete-failed", params: [{ id }] };
  }
}

export async function ReadFile(id) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: id,
  });

  try {
    const response = await s3Client.send(command);
    // Convert stream to buffer
    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  } catch (error) {
    console.error("Error reading file:", error);
    return { error: "s3:read-failed", params: [{ id }] };
  }
}

export async function SignedURL(id) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: id,
  });

  try {
    // 5 hours = 5 * 3600 seconds
    const url = await getSignedUrl(s3Client, command, { expiresIn: 5 * 3600 });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return { error: "s3:signed-url-failed", params: [{ id }] };
  }
}

export async function ListFiles(tokenNext = undefined) {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    MaxKeys: 20,
    ContinuationToken: tokenNext,
  });

  try {
    const response = await s3Client.send(command);
    return {
      list: response.Contents,
      next_token: response.NextContinuationToken,
      is_next: !!response.NextContinuationToken,
    };
  } catch (error) {
    console.error("Error listing files:", error);
    return { error: "s3:list-failed" };
  }
}
