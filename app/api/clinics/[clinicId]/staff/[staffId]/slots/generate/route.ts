// Single date:  { "date": "2024-06-01" }
// Date range:   { "from": "2024-06-01", "to": "2024-06-30" }
// Optional:     { "slotDuration": 20 }  (defaults to 30 min)

import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/auth";
import { generateSlotsForStaff, generateSlotsForRange } from "@/lib/slots";

type Params = { params: { clinicId: string; staffId: string } };

export const POST = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const resolvedParams = params instanceof Promise ? await params : params;
    const session = await requireAuth(req);
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN", "CLINIC_STAFF"]);
    await requireClinicAccess(session, resolvedParams.clinicId);

    const body = await req.json();
    const {
      date,
      from,
      to,
      fromDate,
      toDate,
      slotDuration,
      slotDurationMinutes,
    } = body;
    const resolvedSlotDuration = slotDuration ?? slotDurationMinutes ?? 30;
    const startDate = date ?? from ?? fromDate;
    const endDate = to ?? toDate;

    if (!startDate && !endDate) {
      return NextResponse.json(
        { error: "Provide either 'date' or both 'from' and 'to'" },
        { status: 400 },
      );
    }

    if (startDate && !endDate) {
      const result = await generateSlotsForStaff(
        resolvedParams.staffId,
        resolvedParams.clinicId,
        new Date(startDate),
        resolvedSlotDuration,
      );
      return NextResponse.json(result, { status: 201 });
    }

    const results = await generateSlotsForRange(
      resolvedParams.staffId,
      resolvedParams.clinicId,
      new Date(startDate),
      new Date(endDate),
      resolvedSlotDuration,
    );

    const totalGenerated = results.reduce((sum, r) => sum + r.generated, 0);
    return NextResponse.json(
      { totalGenerated, breakdown: results },
      { status: 201 },
    );
  },
);
