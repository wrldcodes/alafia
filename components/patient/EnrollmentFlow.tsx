"use client";
import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  Button,
  Input,
  Select,
  ProgressBar,
  StepTracker,
} from "@/components/ui";
import { useMultiStep } from "@/hooks/useMultiStep";
import { NIGERIAN_STATES, generatePatientId } from "@/lib/utils";
import type { Patient } from "@/types";

const STEPS = [
  { title: "Personal details", subtitle: "Name, date of birth, gender" },
  { title: "Contact & location", subtitle: "Phone, state, address" },
  { title: "Choose a clinic", subtitle: "Find a clinic near you" },
  { title: "Review & confirm", subtitle: "Check your details" },
];

const PROGRESS_LABELS = ["Personal", "Contact", "Clinic", "Confirm"];

const MOCK_CLINICS = [
  {
    id: "gbagada",
    name: "Gbagada General Hospital",
    location: "Gbagada, Lagos",
    hours: "Mon–Sat, 8am–6pm",
    type: "General practice",
  },
  {
    id: "surulere",
    name: "Community Health Centre Surulere",
    location: "Surulere, Lagos",
    hours: "Mon–Fri, 7am–5pm",
    type: "Community health",
  },
  {
    id: "kano",
    name: "Aminu Kano Teaching Hospital",
    location: "Kano, Kano State",
    hours: "24 hours",
    type: "Teaching hospital",
  },
  {
    id: "ekiti",
    name: "Ekiti State University Teaching Hospital",
    location: "Ado-Ekiti, Ekiti",
    hours: "Mon–Sat, 8am–8pm",
    type: "Specialist care",
  },
];

type FormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  state: string;
  lga: string;
  address: string;
  clinicId: string;
  clinicName: string;
  consent: boolean;
};

const initial: FormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  phone: "",
  email: "",
  state: "",
  lga: "",
  address: "",
  clinicId: "",
  clinicName: "",
  consent: false,
};

/**
 * EnrollmentFlow — 4-step patient registration wizard.
 * Steps: personal → contact → clinic → review.
 * On completion, generates a patient ID and shows success screen.
 */
export function EnrollmentFlow() {
  const { currentStep, goNext, goBack, isLast, progressPercent } =
    useMultiStep(4);
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [done, setDone] = useState(false);

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const clearError = (key: keyof FormData) =>
    setErrors((e) => {
      const n = { ...e };
      delete n[key];
      return n;
    });

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (currentStep === 1) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (!form.dateOfBirth) e.dateOfBirth = "Required";
    }
    if (currentStep === 2) {
      if (!form.phone.trim()) e.phone = "Required";
      if (!form.state) e.state = "Required";
    }
    if (currentStep === 3 && !form.clinicId) {
      e.clinicId = "Please select a clinic";
    }
    if (currentStep === 4 && !form.consent) {
      e.consent = "You must agree to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (isLast) return handleSubmit();
    goNext();
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setPatientId(generatePatientId());
    setDone(true);
    setLoading(false);
  };

  const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }));

  if (done)
    return <SuccessScreen patientId={patientId} name={form.firstName} />;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[400px_1fr]">
      {/* Left panel */}
      <aside className="bg-teal-800 px-10 py-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute bottom-[-100px] right-[-80px] w-[340px] h-[340px] rounded-full bg-[radial-gradient(ellipse,rgba(58,171,138,0.18)_0%,transparent_70%)]" />
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-[20px] text-teal-100 no-underline z-10 relative"
        >
          <div className="w-8 h-8 bg-white/12 rounded-[9px] flex items-center justify-center">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M12 21C12 21 4 15 4 9a8 8 0 0 1 16 0c0 6-8 12-8 12z" />
              <circle cx="12" cy="9" r="2.5" fill="white" stroke="none" />
            </svg>
          </div>
          Aláfíà
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-teal-200 text-[11px] font-medium tracking-[0.08em] uppercase px-3 py-1 rounded-full mb-5">
            <span className="w-1 h-1 bg-teal-400 rounded-full" />
            Patient enrollment
          </div>
          <h2 className="font-display text-[32px] leading-[1.15] tracking-[-0.4px] text-white mb-3.5">
            Your health journey{" "}
            <em className="italic text-teal-200">starts here.</em>
          </h2>
          <p className="text-[14px] font-light text-white/50 leading-[1.7] mb-9">
            Join thousands of community members who now have simple, reliable
            access to healthcare near them.
          </p>
          <StepTracker steps={STEPS} currentStep={currentStep} theme="dark" />
        </div>

        <div className="relative z-10 text-[12px] font-light text-white/30 leading-[1.8]">
          Already enrolled?{" "}
          <Link
            href="/home"
            className="text-white/50 no-underline hover:text-white"
          >
            Sign in
          </Link>
          <br />
          Need help?{" "}
          <Link
            href={"/support" as Route}
            className="text-white/50 no-underline hover:text-white"
          >
            Contact support
          </Link>
        </div>
      </aside>

      {/* Right panel */}
      <main className="flex flex-col items-center justify-center px-12 py-15 bg-white min-h-screen">
        <div className="w-full max-w-[500px]">
          <ProgressBar labels={PROGRESS_LABELS} currentStep={currentStep} />

          {currentStep === 1 && (
            <Step1
              form={form}
              errors={errors}
              set={set}
              clearError={clearError}
            />
          )}
          {currentStep === 2 && (
            <Step2
              form={form}
              errors={errors}
              set={set}
              clearError={clearError}
              stateOptions={stateOptions}
            />
          )}
          {currentStep === 3 && <Step3 form={form} errors={errors} set={set} />}
          {currentStep === 4 && <Step4 form={form} errors={errors} set={set} />}

          <div className="flex items-center justify-between gap-3 mt-8">
            {currentStep > 1 ? (
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border border-sand-200 text-[14px] font-medium text-slate-600 bg-transparent cursor-pointer transition-all hover:border-slate-400 hover:text-slate-800"
              >
                <ArrowLeft size={13} /> Back
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border border-sand-200 text-[14px] font-medium text-slate-600 no-underline transition-all hover:border-slate-400"
              >
                <ArrowLeft size={13} /> Back
              </Link>
            )}
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              loading={loading}
              onClick={handleNext}
            >
              {isLast ? "Complete enrollment" : "Continue"}
              {!isLast && <ArrowRight size={13} />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Step subcomponents ──

function Step1({ form, errors, set, clearError }: any) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.08em] uppercase mb-1.5">
        Step 1 of 4
      </p>
      <h2 className="font-display text-[26px] text-teal-900 mb-2">
        Tell us about yourself
      </h2>
      <p className="text-[14px] font-light text-slate-400 mb-7">
        Just the basics — this helps clinics identify you and provide the right
        care.
      </p>
      <div className="grid grid-cols-2 gap-3.5 mb-4">
        <Input
          label="First name"
          placeholder="Amaka"
          value={form.firstName}
          error={errors.firstName}
          onChange={(e) => {
            set("firstName", e.target.value);
            clearError("firstName");
          }}
        />
        <Input
          label="Last name"
          placeholder="Obi"
          value={form.lastName}
          error={errors.lastName}
          onChange={(e) => {
            set("lastName", e.target.value);
            clearError("lastName");
          }}
        />
      </div>
      <div className="mb-4">
        <Input
          label="Date of birth"
          type="date"
          value={form.dateOfBirth}
          error={errors.dateOfBirth}
          hint="Used to verify your identity at the clinic"
          onChange={(e) => {
            set("dateOfBirth", e.target.value);
            clearError("dateOfBirth");
          }}
        />
      </div>
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-600 mb-1.5">Gender</p>
        <div className="flex gap-2 flex-wrap">
          {["Male", "Female", "Prefer not to say"].map((g) => (
            <button
              key={g}
              onClick={() => set("gender", g)}
              className={`px-4 py-2 rounded-full border text-[13px] font-medium cursor-pointer transition-all ${form.gender === g ? "border-teal-600 bg-teal-50 text-teal-700" : "border-sand-200 bg-white text-slate-600 hover:border-teal-200"}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <Select
        label="Blood group"
        optional
        placeholder="Select blood group"
        value={form.bloodGroup}
        onChange={(e) => set("bloodGroup", e.target.value)}
        options={[
          "A+",
          "A−",
          "B+",
          "B−",
          "AB+",
          "AB−",
          "O+",
          "O−",
          "Unknown",
        ].map((v) => ({ value: v, label: v }))}
      />
    </div>
  );
}

function Step2({ form, errors, set, clearError, stateOptions }: any) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.08em] uppercase mb-1.5">
        Step 2 of 4
      </p>
      <h2 className="font-display text-[26px] text-teal-900 mb-2">
        How can we reach you?
      </h2>
      <p className="text-[14px] font-light text-slate-400 mb-7">
        Your phone number is your primary contact for reminders and updates.
      </p>
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-600 mb-1.5">
          Phone number
        </p>
        <div className="flex gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-3 border border-sand-200 rounded-xl bg-sand-50 text-[14px] font-medium text-slate-600 whitespace-nowrap flex-shrink-0">
            🇳🇬 +234
          </div>
          <input
            type="tel"
            placeholder="080 0000 0000"
            value={form.phone}
            onChange={(e) => {
              set("phone", e.target.value);
              clearError("phone");
            }}
            className="flex-1 px-4 py-3 text-sm bg-sand-50 border border-sand-200 rounded-xl outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/10"
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>
      <div className="mb-4">
        <Input
          label="Email address"
          optional
          type="email"
          placeholder="amaka@example.com"
          value={form.email}
          hint="For digital records and appointment confirmations"
          onChange={(e) => set("email", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Select
          label="State of residence"
          placeholder="Select your state"
          value={form.state}
          error={errors.state}
          options={stateOptions}
          onChange={(e) => {
            set("state", e.target.value);
            clearError("state");
          }}
        />
      </div>
      <div className="mb-4">
        <Input
          label="Local government area"
          optional
          placeholder="e.g. Gbagada, Surulere"
          value={form.lga}
          onChange={(e) => set("lga", e.target.value)}
        />
      </div>
      <Input
        label="Home address"
        optional
        placeholder="Street address, town/city"
        value={form.address}
        onChange={(e) => set("address", e.target.value)}
      />
    </div>
  );
}

function Step3({ form, errors, set }: any) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.08em] uppercase mb-1.5">
        Step 3 of 4
      </p>
      <h2 className="font-display text-[26px] text-teal-900 mb-2">
        Choose your clinic
      </h2>
      <p className="text-[14px] font-light text-slate-400 mb-6">
        Select a primary clinic near you. You can always visit other Aláfíà
        clinics later.
      </p>
      {errors.clinicId && (
        <p className="text-xs text-red-600 mb-3">{errors.clinicId}</p>
      )}
      <div className="flex flex-col gap-3">
        {[
          {
            id: "gbagada",
            name: "Gbagada General Hospital",
            location: "Gbagada, Lagos",
            hours: "Mon–Sat, 8am–6pm",
            type: "General practice",
          },
          {
            id: "surulere",
            name: "Community Health Centre Surulere",
            location: "Surulere, Lagos",
            hours: "Mon–Fri, 7am–5pm",
            type: "Community health",
          },
          {
            id: "kano",
            name: "Aminu Kano Teaching Hospital",
            location: "Kano, Kano State",
            hours: "24 hours",
            type: "Teaching hospital",
          },
          {
            id: "ekiti",
            name: "Ekiti State University Teaching Hospital",
            location: "Ado-Ekiti, Ekiti",
            hours: "Mon–Sat, 8am–8pm",
            type: "Specialist care",
          },
        ].map((clinic) => (
          <div
            key={clinic.id}
            onClick={() => {
              set("clinicId", clinic.id);
              set("clinicName", clinic.name);
            }}
            className={`border rounded-[18px] p-4 flex items-start gap-3 cursor-pointer transition-all ${form.clinicId === clinic.id ? "border-teal-600 bg-teal-50 shadow-[0_0_0_3px_rgba(58,171,138,0.1)]" : "border-sand-200 bg-white hover:border-teal-200"}`}
          >
            <div
              className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 ${form.clinicId === clinic.id ? "bg-teal-100 border border-teal-200" : "bg-earth-50 border border-earth-200"}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={form.clinicId === clinic.id ? "#165e4a" : "#c4a06e"}
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <div className="flex-1">
              <p
                className={`text-[14px] font-semibold mb-1 ${form.clinicId === clinic.id ? "text-teal-800" : "text-slate-800"}`}
              >
                {clinic.name}
              </p>
              <div className="flex gap-3 flex-wrap text-[12px] font-light text-slate-400 mb-2">
                <span>{clinic.location}</span>
                <span>{clinic.hours}</span>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                {clinic.type}
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${form.clinicId === clinic.id ? "bg-teal-600 border-2 border-teal-600" : "border-2 border-sand-200"}`}
            >
              {form.clinicId === clinic.id && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4({ form, errors, set }: any) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.08em] uppercase mb-1.5">
        Step 4 of 4
      </p>
      <h2 className="font-display text-[26px] text-teal-900 mb-2">
        Review your details
      </h2>
      <p className="text-[14px] font-light text-slate-400 mb-6">
        Confirm everything looks right before we create your account.
      </p>

      {[
        {
          title: "Personal",
          fields: [
            ["Full name", `${form.firstName} ${form.lastName}`],
            ["Gender", form.gender || "—"],
            ["Blood group", form.bloodGroup || "—"],
          ],
        },
        {
          title: "Contact & location",
          fields: [
            ["Phone", `+234 ${form.phone}`],
            ["State", form.state || "—"],
            ["Email", form.email || "—"],
          ],
        },
        {
          title: "Primary clinic",
          fields: [["Clinic", form.clinicName || "—"]],
        },
      ].map(({ title, fields }) => (
        <div key={title} className="mb-5">
          <p className="text-[11px] font-semibold text-teal-600 tracking-[0.07em] uppercase mb-2.5 pb-2 border-b border-sand-200">
            {title}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {fields.map(([label, value]) => (
              <div key={label}>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <p className="text-[14px] text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
        onClick={() => set("consent", !form.consent)}
        className={`flex items-start gap-3 p-4 rounded-[12px] border cursor-pointer transition-all mb-1 ${form.consent ? "border-teal-200 bg-teal-50" : "border-sand-200 bg-sand-50 hover:border-teal-200"}`}
      >
        <div
          className={`w-4.5 h-4.5 rounded-[4px] flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${form.consent ? "bg-teal-600 border-2 border-teal-600" : "bg-white border-2 border-sand-200"}`}
        >
          {form.consent && (
            <Check size={9} strokeWidth={3} className="text-white" />
          )}
        </div>
        <p className="text-[13px] font-light text-slate-600 leading-[1.6]">
          I agree to Aláfíà's Terms of Service and Privacy Policy. I consent to
          my health information being shared with my selected clinic.
        </p>
      </div>
      {errors.consent && (
        <p className="text-xs text-red-600">{errors.consent}</p>
      )}
    </div>
  );
}

function SuccessScreen({
  patientId,
  name,
}: {
  patientId: string;
  name: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-[420px] w-full text-center">
        <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-100 flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-teal-600" strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-[30px] text-teal-900 mb-2.5">
          You're enrolled!
        </h2>
        <p className="text-[15px] font-light text-slate-400 leading-[1.7] mb-8">
          Welcome to Aláfíà, {name}. Your health profile is ready and your
          clinic has been notified.
        </p>
        <div className="bg-teal-800 rounded-2xl p-6 flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-medium text-teal-200 tracking-wide uppercase mb-1.5">
              Your patient ID
            </p>
            <p className="font-display text-[26px] text-white tracking-[2px]">
              {patientId}
            </p>
            <p className="text-[11px] font-light text-white/40 mt-1">
              Keep this safe — you'll need it at the clinic
            </p>
          </div>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          >
            <path d="M12 21C12 21 4 15 4 9a8 8 0 0 1 16 0c0 6-8 12-8 12z" />
            <circle
              cx="12"
              cy="9"
              r="2.5"
              fill="rgba(255,255,255,0.2)"
              stroke="none"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-2.5">
          <Button variant="primary" size="lg" fullWidth asChild>
            <a href="/patient">Go to my health portal</a>
          </Button>
          <Button variant="outline" size="lg" fullWidth asChild>
            <a href="/clinics">Book my first appointment</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
