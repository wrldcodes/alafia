// app/api/clinics/[clinicId]/appointments/[appointmentId]/record/attachments/route.ts
//
// GET  → list attachments on this record (no URLs — use signed URL endpoint)
// POST → upload a file to Cloudinary and save metadata to DB

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/validators/auth";
import { createAttachmentSchema } from "@/lib/validators/medical";
import { uploadToCloudinary } from "@/lib/cloudinary";

type Params = { params: Promise<{ clinicId: string; appointmentId: string }> };

// GET /api/clinics/:clinicId/appointments/:appointmentId/record/attachments
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, appointmentId } = await params;
    const session = await requireAuth(req);
    requireClinicAccess(session, clinicId);

    const record = await prisma.medicalRecord.findUnique({
      where: { appointmentId },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 },
      );
    }

    // Patients can only view their own
    if (session.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.userId },
      });
      if (record.patientId !== patient?.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Return metadata only — no Cloudinary URLs exposed directly
    const attachments = await prisma.recordAttachment.findMany({
      where: { recordId: record.id },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        attachmentType: true,
        uploadedById: true,
        createdAt: true,
        // cloudinaryId and url intentionally excluded — use /signed-url
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ attachments });
  },
);

// POST /api/clinics/:clinicId/appointments/:appointmentId/record/attachments
// Accepts multipart/form-data with a file field.
// Uploads to Cloudinary then stores metadata in DB.
export const POST = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, appointmentId } = await params;
    const session = await requireAuth(req);
    requireRole(session, [
      "SUPER_ADMIN",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "DOCTOR",
    ]);
    requireClinicAccess(session, clinicId);

    const record = await prisma.medicalRecord.findUnique({
      where: { appointmentId },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 },
      );
    }

    // Doctors can only upload to their own records
    if (session.role === "DOCTOR" && record.doctorId !== session.staffId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const attachmentType = formData.get("attachmentType") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "file field is required" },
        { status: 400 },
      );
    }

    // Size limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 10MB" },
        { status: 400 },
      );
    }

    // Allowed types
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WEBP, and PDF files are allowed" },
        { status: 400 },
      );
    }

    // Validate attachmentType with Zod
    const typeValidation =
      createAttachmentSchema.shape.attachmentType.safeParse(
        attachmentType ?? "OTHER",
      );
    if (!typeValidation.success) {
      return NextResponse.json(
        { error: "Invalid attachmentType" },
        { status: 400 },
      );
    }

    // Convert File to Buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary under a clinic-scoped folder
    const uploaded = await uploadToCloudinary(buffer, {
      folder: `clinic_records/${clinicId}`,
      fileName: file.name,
      fileType: file.type,
    });

    // Save metadata to DB
    const attachment = await prisma.recordAttachment.create({
      data: {
        recordId: record.id,
        patientId: record.patientId,
        clinicId,
        cloudinaryId: uploaded.cloudinaryId,
        url: uploaded.url,
        fileName: file.name,
        fileType: file.type,
        fileSize: uploaded.fileSize,
        attachmentType: typeValidation.data,
        uploadedById: session.userId,
      },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        attachmentType: true,
        createdAt: true,
        // url and cloudinaryId intentionally excluded from response
      },
    });

    return NextResponse.json({ attachment }, { status: 201 });
  },
);
