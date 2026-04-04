import { useState } from 'react'

export type DashboardView =
  | 'overview'
  | 'patients'
  | 'appointments'
  | 'billing'
  | 'records'
  | 'settings'

interface UseClinicDashboardReturn {
  activeView: DashboardView
  setView: (view: DashboardView) => void
}

/**
 * useClinicDashboard — manages active view state for the clinic dashboard.
 */
export function useClinicDashboard(
  initial: DashboardView = 'overview'
): UseClinicDashboardReturn {
  const [activeView, setActiveView] = useState<DashboardView>(initial)
  return { activeView, setView: setActiveView }
}
