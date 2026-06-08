// hooks/useDashboard.ts
// Custom hooks for fetching dashboard data with loading and error states.

import { useState, useEffect, useCallback } from "react";

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

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

export type ClinicDashboardData = {
  stats: {
    totalAppointmentsToday: number;
    appointmentsByStatus: Record<string, number>;
    newPatientsToday: number;
    totalPatientsAllTime: number;
    medicalRecordsThisWeek: number;
    activeDoctors: number;
    totalStaff: number;
    revenueToday: null;
  };
  charts: {
    appointmentTrend: { date: string; total: number; completed: number; cancelled: number }[];
    statusBreakdown: { status: string; count: number }[];
  };
  lists: {
    upcomingToday: {
      id: string;
      status: string;
      reason: string;
      patient: { firstName: string; lastName: string; phone: string };
      doctor: { specialization: string; user: { email: string } };
      slot: { startTime: string; endTime: string; duration: number };
    }[];
  };
};

export type DoctorDashboardData = {
  stats: {
    totalAppointmentsToday: number;
    appointmentsByStatus: Record<string, number>;
    patientsSeenThisWeek: number;
    recordsCreatedThisWeek: number;
  };
  lists: {
    todaySchedule: {
      id: string;
      status: string;
      reason: string;
      patient: { firstName: string; lastName: string; phone: string; dateOfBirth: string };
      slot: { startTime: string; endTime: string; duration: number };
    }[];
    nextAppointment: any;
  };
};

export type PatientDashboardData = {
  stats: {
    totalVisits: number;
    activePrescriptions: number;
    upcomingAppointmentsCount: number;
    totalRecords: number;
  };
  lists: {
    nextAppointment: any;
    upcomingAppointments: any[];
    recentRecords: any[];
  };
};

export const useClinicDashboard = () =>
  useFetch<ClinicDashboardData>("/api/dashboard/clinic");

export const useDoctorDashboard = () =>
  useFetch<DoctorDashboardData>("/api/dashboard/doctor");

export const usePatientDashboard = () =>
  useFetch<PatientDashboardData>("/api/dashboard/patient");
