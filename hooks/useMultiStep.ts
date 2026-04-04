import { useState } from 'react'

interface UseMultiStepReturn {
  currentStep: number
  totalSteps: number
  isFirst: boolean
  isLast: boolean
  goNext: () => void
  goBack: () => void
  goToStep: (step: number) => void
  progressPercent: number
}

/**
 * useMultiStep — manages step state for multi-step forms.
 * Steps are 1-indexed (step 1 = first step).
 */
export function useMultiStep(totalSteps: number): UseMultiStepReturn {
  const [currentStep, setCurrentStep] = useState(1)

  const goNext = () =>
    setCurrentStep((s) => Math.min(s + 1, totalSteps))

  const goBack = () =>
    setCurrentStep((s) => Math.max(s - 1, 1))

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) setCurrentStep(step)
  }

  return {
    currentStep,
    totalSteps,
    isFirst: currentStep === 1,
    isLast: currentStep === totalSteps,
    goNext,
    goBack,
    goToStep,
    progressPercent: Math.round((currentStep / totalSteps) * 100),
  }
}
