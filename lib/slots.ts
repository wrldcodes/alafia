
// Generates TimeSlot records from a doctor's WorkingHours for a given date.
// Called by the clinic admin via the slots/generate route.
// Can also be wired to a cron job to auto-generate slots N days ahead.

import { prisma } from "@/lib/prisma";
import { addMinutes, format, parse, isBefore, isEqual } from "date-fns";

export async function generateSlotsForStaff(
  staffId: string,
  clinicId: string,
  date: Date, // the calendar date to generate for
  slotDuration = 30, // minutes per slot
): Promise<{ generated: number; message?: string }> {
  const dayOfWeek = date.getDay(); // 0 Sun … 6 Sat

  const workingDay = await prisma.workingHours.findUnique({
    where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
  });

  if (!workingDay || !workingDay.isActive) {
    return { generated: 0, message: "No active schedule for this day" };
  }

  // Avoid regenerating if slots already exist for this date
  const dateOnly = new Date(format(date, "yyyy-MM-dd"));
  const existingCount = await prisma.timeSlot.count({
    where: { staffId, date: dateOnly },
  });
  if (existingCount > 0) {
    return { generated: 0, message: "Slots already exist for this date" };
  }

  // Build slot list from startTime → endTime in slotDuration increments
  const dateStr = format(date, "yyyy-MM-dd");
  let cursor = parse(
    `${dateStr} ${workingDay.startTime}`,
    "yyyy-MM-dd HH:mm",
    new Date(),
  );
  const dayEnd = parse(
    `${dateStr} ${workingDay.endTime}`,
    "yyyy-MM-dd HH:mm",
    new Date(),
  );

  const slots: {
    staffId: string;
    clinicId: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    duration: number;
  }[] = [];

  while (isBefore(cursor, dayEnd)) {
    const slotEnd = addMinutes(cursor, slotDuration);
    if (isBefore(dayEnd, slotEnd) || isEqual(dayEnd, cursor)) break;

    slots.push({
      staffId,
      clinicId,
      date: dateOnly,
      startTime: new Date(cursor),
      endTime: new Date(slotEnd),
      duration: slotDuration,
    });

    cursor = slotEnd;
  }

  if (slots.length === 0) {
    return { generated: 0, message: "No slots fit within working hours" };
  }

  await prisma.timeSlot.createMany({ data: slots });
  return { generated: slots.length };
}

// Bulk generate for a date range (e.g. next 30 days). Useful for cron.
export async function generateSlotsForRange(
  staffId: string,
  clinicId: string,
  fromDate: Date,
  toDate: Date,
  slotDuration = 30,
) {
  const results: { date: string; generated: number; message?: string }[] = [];
  let current = new Date(fromDate);

  while (isBefore(current, toDate) || isEqual(current, toDate)) {
    const result = await generateSlotsForStaff(
      staffId,
      clinicId,
      current,
      slotDuration,
    );
    results.push({ date: format(current, "yyyy-MM-dd"), ...result });
    current = addMinutes(current, 60 * 24); // next day
  }

  return results;
}
