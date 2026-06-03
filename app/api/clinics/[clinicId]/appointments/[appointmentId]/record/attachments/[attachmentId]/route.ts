// app/api/clinics/[clinicId]/appointments/[appointmentId]/record/attachments/[attachmentId]/route.ts
//
// GET    → returns a short-lived signed Cloudinary URL to view/download the file
// DELETE → removes from Cloudinary and deletes DB record

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/validators/auth";
import { getSignedUrl, deleteFromCloudinary } from "@/lib/cloudinary";

type Params = {
  params: Promise<{
    clinicId: string;
    appointmentId: string;
    attachmentId: string;
  }>;
};

// GET → signed download URL (expires in 1 hour)
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, attachmentId } = await params;
    const session = await requireAuth(req);
    requireClinicAccess(session, clinicId);

    const attachment = await prisma.recordAttachment.findUnique({
      where: { id: attachmentId },
      include: { record: { select: { patientId: true } } },
    });

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 },
      );
    }

    // Patients can only access their own files
    if (session.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.userId },
      });
      if (attachment.patientId !== patient?.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const signedUrl = getSignedUrl(attachment.cloudinaryId);

    return NextResponse.json({
      url: signedUrl,
      fileName: attachment.fileName,
      fileType: attachment.fileType,
      expiresIn: 3600, // seconds
    });
  },
);

// DELETE → remove file from Cloudinary + delete DB record
export const DELETE = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, attachmentId } = await params;
    const session = await requireAuth(req);
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN", "CLINIC_STAFF"]);
    requireClinicAccess(session, clinicId);

    const attachment = await prisma.recordAttachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 },
      );
    }

    // Delete from Cloudinary first
    await deleteFromCloudinary(attachment.cloudinaryId);

    // Then remove from DB
    await prisma.recordAttachment.delete({
      where: { id: attachmentId },
    });

    return NextResponse.json({ message: "Attachment deleted" });
  },
);
