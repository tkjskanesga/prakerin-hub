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
import logger from "./logger";

const endpoint = process.env.S3_ENDPOINT ? process.env.S3_ENDPOINT?.startsWith("http")
  ? process.env.S3_ENDPOINT
  : `http://${process.env.S3_ENDPOINT}` : `https://${process.env.S3_BUCKET}.s3.amazonaws.com`;
const forcePathStyle = process.env.S3_ENDPOINT === "true" ? true : false;

if(endpoint.includes("amazonaws.com") && !!forcePathStyle) {
  logger.warn("S3 Endpoint contains 'amazonaws.com' and forcePathStyle is true, this may cause issues");
}

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: endpoint,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: forcePathStyle,
});

const BUCKET_NAME = String(process.env.S3_BUCKET || "e-pkl");

async function ensureBucketExists() {
  const logaction = logger.child({ system: "s3", function: "ensureBucketExists" });
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    return { success: true };
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      logaction.debug(`Bucket ${BUCKET_NAME} does not exist. Creating...`);
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        logaction.debug(`Bucket ${BUCKET_NAME} created successfully.`);
        return { success: true };
      } catch (createError) {
        console.error("Error creating bucket:", createError);
        return {
          success: false,
          error: "s3:s3-bucket-create-failed",
          params: [{ bucket: BUCKET_NAME }],
        };
      }
    } else {
      logaction.error({ error });
      return {
        success: false,
        error: "s3:s3-bucket-check-failed",
        params: [{ bucket: BUCKET_NAME }],
      };
    }
  }
}

export async function UploadFile(
  buffer,
  { ext = ".ext", original_name = "" } = {},
) {
  const logaction = logger.child({ system: "s3", function: "UploadFile" });
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
    logaction.error({ error });
    return { error: "s3:s3-upload-failed" };
  }
}

export async function DeleteFile(id) {
  const logaction = logger.child({ system: "s3", function: "DeleteFile" });
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: id,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    logaction.error({ error });
    return { error: "s3:s3-delete-failed", params: [{ id }] };
  }
}

export async function ReadFile(id) {
  const logaction = logger.child({ system: "s3", function: "ReadFile" });
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
    logaction.error({ error });
    return { error: "s3:s3-read-failed", params: [{ id }] };
  }
}

export async function SignedURL(id) {
  const logaction = logger.child({ system: "s3", function: "SignedURL" });
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: id,
  });

  try {
    // 5 hours = 5 * 3600 seconds
    const url = await getSignedUrl(s3Client, command, { expiresIn: 5 * 3600 });
    return url;
  } catch (error) {
    logaction.error({ error });
    return { error: "s3:s3-signed-url-failed", params: [{ id }] };
  }
}

export async function ListFiles(tokenNext = undefined) {
  const logaction = logger.child({ system: "s3", function: "ListFiles" });
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
    logaction.error({ error });
    return { error: "s3:s3-list-failed" };
  }
}
