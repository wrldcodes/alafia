import { useState } from 'react'

export type PatientView =
  | 'home'
  | 'appointments'
  | 'records'
  | 'clinics'
  | 'tips'
  | 'profile'

interface UsePatientDashboardReturn {
  activeView: PatientView
  setView: (view: PatientView) => void
}

/**
 * usePatientDashboard — manages active view state for the patient portal.
 */
export function usePatientDashboard(
  initial: PatientView = 'home'
): UsePatientDashboardReturn {
  const [activeView, setActiveView] = useState<PatientView>(initial)
  return { activeView, setView: setActiveView }
}
