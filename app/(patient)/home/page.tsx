import type { Metadata } from "next";
import { PatientDashboard } from "@/components/patient";
import { metadataBase } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase,
  title: "My Health Portal",
  description:
    "View your appointments, medical records, and find clinics near you.",
};

export default function PatientDashboardPage() {
  return <PatientDashboard />;
}
