"use client";

// hooks/useDashboard.ts

import { useState, useEffect, useCallback } from "react";

// ─── Generic fetch hook ───────────────────────────────────────────────────

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        credentials: "include", // sends cookie automatically
      });
      if (res.status === 401)
        throw new Error("Session expired. Please log in again.");
      if (res.status === 403)
        throw new Error("You don't have access to this dashboard.");
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const json = await res.json();
      setData(json);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}

// ─── Types ────────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED";

export type SlotSummary = {
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
};

export type PatientSummary = {
  id?: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  dateOfBirth?: string;
};

export type DoctorSummary = {
  id?: string;
  specialization: string;
  user: { email: string };
};

export type ClinicSummary = {
  id: string;
  clinicName: string;
  address?: string;
  phone?: string;
};

export type UpcomingAppointment = {
  id: string;
  status: AppointmentStatus;
  reason: string;
  patient: PatientSummary;
  doctor: DoctorSummary;
  slot: SlotSummary;
};

export type TrendPoint = {
  date: string; // "Mon 01"
  total: number;
  completed: number;
  cancelled: number;
};

export type StatusBreakpoint = {
  status: AppointmentStatus;
  count: number;
};

export type RecordSummary = {
  id: string;
  diagnosis: string;
  chiefComplaint: string;
  createdAt: string;
  clinic: Pick<ClinicSummary, "id" | "clinicName">;
  doctor: DoctorSummary;
  _count: { prescriptions: number; attachments: number };
};

// ── Clinic Admin ──────────────────────────────────────────────────────────
export type ClinicDashboardData = {
  stats: {
    totalAppointmentsToday: number;
    appointmentsByStatus: Record<AppointmentStatus, number>;
    newPatientsToday: number;
    totalPatientsAllTime: number;
    medicalRecordsThisWeek: number;
    activeDoctors: number;
    totalStaff: number;
    revenueToday: null;
  };
  charts: {
    appointmentTrend: TrendPoint[];
    statusBreakdown: StatusBreakpoint[];
  };
  lists: {
    upcomingToday: UpcomingAppointment[];
    recentRecords: RecordSummary[];
  };
  meta: { generatedAt: string; clinicId: string };
};

// ── Doctor ────────────────────────────────────────────────────────────────
export type DoctorScheduleItem = {
  id: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  patient: PatientSummary;
  slot: SlotSummary;
};

export type DoctorDashboardData = {
  stats: {
    totalAppointmentsToday: number;
    appointmentsByStatus: Record<AppointmentStatus, number>;
    patientsSeenThisWeek: number;
    recordsCreatedThisWeek: number;
  };
  lists: {
    todaySchedule: DoctorScheduleItem[];
    nextAppointment: DoctorScheduleItem | null;
  };
  meta: { generatedAt: string; staffId: string; clinicId: string };
};

// ── Patient ───────────────────────────────────────────────────────────────
export type PatientRecord = RecordSummary;

export type PatientUpcomingAppointment = {
  id: string;
  status: AppointmentStatus;
  reason: string;
  clinic: ClinicSummary;
  doctor: DoctorSummary;
  slot: SlotSummary;
};

export type PatientDashboardData = {
  stats: {
    totalVisits: number;
    activePrescriptions: number;
    upcomingAppointmentsCount: number;
    totalRecords: number;
  };
  lists: {
    nextAppointment: PatientUpcomingAppointment | null;
    upcomingAppointments: PatientUpcomingAppointment[];
    recentRecords: PatientRecord[];
  };
  meta: { generatedAt: string; patientId: string };
};

// ─── Exported hooks ───────────────────────────────────────────────────────

export const useClinicDashboard = () =>
  useFetch<ClinicDashboardData>("/api/dashboard/clinic");

export const useDoctorDashboard = () =>
  useFetch<DoctorDashboardData>("/api/dashboard/doctor");

export const usePatientDashboard = () =>
  useFetch<PatientDashboardData>("/api/dashboard/patient");
