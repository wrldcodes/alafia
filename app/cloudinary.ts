// lib/cloudinary.ts
// Cloudinary upload and delete helpers for medical record attachments.
// Install: npm install cloudinary

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ─── Upload ───────────────────────────────────────────────────────────────
// Accepts a base64 data URI or a file buffer converted to base64.
// Returns the Cloudinary response with public_id and secure_url.

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: {
    folder: string;       // e.g. "clinic_records/clx_clinic_id"
    fileName: string;
    fileType: string;     // MIME type
  }
) {
  // Convert buffer to base64 data URI
  const base64 = fileBuffer.toString("base64");
  const dataUri = `data:${options.fileType};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: options.folder,
    public_id: `${Date.now()}_${options.fileName.replace(/\s+/g, "_")}`,
    resource_type: "auto",   // handles PDF, images, etc.
    access_mode: "authenticated", // private — requires signed URL to access
  });

  return {
    cloudinaryId: result.public_id,
    url: result.secure_url,
    fileSize: result.bytes,
  };
}

// ─── Signed URL ───────────────────────────────────────────────────────────
// Medical files are stored as private/authenticated on Cloudinary.
// Generate a temporary signed URL to let the patient/doctor view it.
// URL expires in 1 hour by default.

export function getSignedUrl(
  cloudinaryId: string,
  expiresInSeconds = 3600
): string {
  return cloudinary.url(cloudinaryId, {
    secure: true,
    sign_url: true,
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────
// Hard deletes the file from Cloudinary.
// Called when a RecordAttachment is deleted from the DB.

export async function deleteFromCloudinary(cloudinaryId: string) {
  await cloudinary.uploader.destroy(cloudinaryId, {
    resource_type: "auto",
    type: "authenticated",
  });
}
