"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import {
  Button,
  Input,
  Select,
  ProgressBar,
  StepTracker,
} from "@/components/ui";
import { useMultiStep } from "@/hooks/useMultiStep";
import {
  NIGERIAN_STATES,
  CLINIC_SERVICES,
  INSURANCE_PROVIDERS,
  LANGUAGES,
  generateClinicId,
} from "@/lib/utils";

const STEPS = [
  { title: "Clinic details", subtitle: "Name, type, description" },
  { title: "Location & contact", subtitle: "Address, phone, hours" },
  { title: "Services offered", subtitle: "Specialties & departments" },
  { title: "Admin account", subtitle: "Your login & team" },
  { title: "Review & launch", subtitle: "Confirm and go live" },
];

const PROGRESS_LABELS = ["Details", "Location", "Services", "Admin", "Review"];

const CLINIC_TYPES = [
  "General practice / Primary care",
  "Community health centre",
  "Teaching hospital",
  "Specialist clinic",
  "Maternity / Antenatal clinic",
  "Dental clinic",
  "Eye clinic / Ophthalmology",
  "Mental health clinic",
  "Pharmacy clinic",
  "Rural health post",
  "Private hospital",
  "Other",
];

type FormData = {
  clinicName: string;
  clinicType: string;
  description: string;
  yearEstablished: string;
  beds: string;
  state: string;
  lga: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  services: string[];
  insurance: string[];
  languages: string[];
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  adminPassword2: string;
  adminRole: string;
  consent: boolean;
};

const initial: FormData = {
  clinicName: "",
  clinicType: "",
  description: "",
  yearEstablished: "",
  beds: "",
  state: "",
  lga: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  services: [],
  insurance: [],
  languages: [],
  adminFirstName: "",
  adminLastName: "",
  adminEmail: "",
  adminPassword: "",
  adminPassword2: "",
  adminRole: "",
  consent: false,
};

/**
 * ClinicSignupFlow — 5-step clinic registration wizard.
 * Steps: details → location → services → admin → review.
 */
export function ClinicSignupFlow() {
  const { currentStep, goNext, goBack, isLast } = useMultiStep(5);
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [clinicId, setClinicId] = useState("");
  const [done, setDone] = useState(false);

  const set = (key: keyof FormData, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleArr = (
    key: "services" | "insurance" | "languages",
    value: string,
  ) => {
    setForm((f) => {
      const arr = f[key] as string[];
      return {
        ...f,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const clearError = (key: keyof FormData) =>
    setErrors((e) => {
      const n = { ...e };
      delete n[key];
      return n;
    });

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (currentStep === 1) {
      if (!form.clinicName.trim()) e.clinicName = "Required";
      if (!form.clinicType) e.clinicType = "Required";
    }
    if (currentStep === 2) {
      if (!form.state) e.state = "Required";
      if (!form.address.trim()) e.address = "Required";
      if (!form.phone.trim()) e.phone = "Required";
    }
    if (currentStep === 3 && form.services.length === 0) {
      e.services = "Select at least one service";
    }
    if (currentStep === 4) {
      if (!form.adminFirstName.trim()) e.adminFirstName = "Required";
      if (!form.adminLastName.trim()) e.adminLastName = "Required";
      if (!form.adminEmail.includes("@")) e.adminEmail = "Valid email required";
      if (form.adminPassword.length < 8) e.adminPassword = "Min 8 characters";
      if (form.adminPassword !== form.adminPassword2)
        e.adminPassword2 = "Passwords do not match";
    }
    if (currentStep === 5 && !form.consent) {
      e.consent = "You must confirm to continue";
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
    await new Promise((r) => setTimeout(r, 1600));
    setClinicId(generateClinicId());
    setDone(true);
    setLoading(false);
  };

  const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }));
  const typeOptions = CLINIC_TYPES.map((t) => ({ value: t, label: t }));

  if (done)
    return <ClinicSuccessScreen clinicId={clinicId} name={form.clinicName} />;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[420px_1fr]">
      {/* Left panel — light theme */}
      <aside className="bg-sand-50 border-r border-sand-200 px-10 py-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(ellipse,var(--tw-colors-teal-50,#edf7f3)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-60px] left-[-40px] w-[220px] h-[220px] rounded-full bg-[radial-gradient(ellipse,var(--tw-colors-earth-100,#f2e8d8)_0%,transparent_70%)]" />

        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-[20px] text-teal-800 no-underline z-10 relative"
        >
          <div className="w-8 h-8 bg-teal-700 rounded-[9px] flex items-center justify-center">
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
          <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-[11px] font-medium tracking-[0.08em] uppercase px-3 py-1 rounded-full mb-5">
            <span className="w-1 h-1 bg-teal-400 rounded-full" /> Clinic
            registration
          </div>
          <h2 className="font-display text-[30px] leading-[1.15] tracking-[-0.4px] text-teal-900 mb-3">
            Your clinic,{" "}
            <em className="italic text-teal-600">
              connected to your community.
            </em>
          </h2>
          <p className="text-[14px] font-light text-slate-400 leading-[1.7] mb-9">
            Set up your clinic on Aláfíà in minutes and start receiving patients
            from your local community today.
          </p>
          <StepTracker steps={STEPS} currentStep={currentStep} theme="light" />
        </div>

        <div className="relative z-10">
          {[
            "Verified clinic listing",
            "Live in under 10 minutes",
            "Reach patients in your area",
            "Free to start, no card needed",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-[12px] text-slate-400 mb-2.5"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3aab8a"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {item}
            </div>
          ))}
          <p className="text-[12px] font-light text-slate-400 mt-4 leading-[1.8]">
            Already registered?{" "}
            <Link
              href="/clinic"
              className="text-teal-600 no-underline hover:underline"
            >
              Sign in to your dashboard
            </Link>
          </p>
        </div>
      </aside>

      {/* Right panel */}
      <main className="flex flex-col items-center justify-center px-13 py-15 bg-white min-h-screen">
        <div className="w-full max-w-[520px]">
          <ProgressBar labels={PROGRESS_LABELS} currentStep={currentStep} />

          {currentStep === 1 && (
            <ClinicStep1
              form={form}
              errors={errors}
              set={set}
              clearError={clearError}
              typeOptions={typeOptions}
            />
          )}
          {currentStep === 2 && (
            <ClinicStep2
              form={form}
              errors={errors}
              set={set}
              clearError={clearError}
              stateOptions={stateOptions}
            />
          )}
          {currentStep === 3 && (
            <ClinicStep3 form={form} errors={errors} toggleArr={toggleArr} />
          )}
          {currentStep === 4 && (
            <ClinicStep4
              form={form}
              errors={errors}
              set={set}
              clearError={clearError}
            />
          )}
          {currentStep === 5 && (
            <ClinicStep5 form={form} errors={errors} set={set} />
          )}

          <div className="flex items-center justify-between gap-3 mt-8">
            {currentStep > 1 ? (
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border border-sand-200 text-[14px] font-medium text-slate-600 bg-transparent cursor-pointer transition-all hover:border-slate-400"
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
              {isLast ? "Launch clinic" : "Continue"}
              {!isLast && <ArrowRight size={13} />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ClinicStep1({ form, errors, set, clearError, typeOptions }: any) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.08em] uppercase mb-1.5">
        Step 1 of 5
      </p>
      <h2 className="font-display text-[26px] text-teal-900 mb-2">
        Tell us about your clinic
      </h2>
      <p className="text-[14px] font-light text-slate-400 mb-7">
        This information will appear on your public listing that patients see.
      </p>
      <div className="mb-4">
        <Input
          label="Clinic name"
          placeholder="e.g. Gbagada Community Health Centre"
          value={form.clinicName}
          error={errors.clinicName}
          onChange={(e) => {
            set("clinicName", e.target.value);
            clearError("clinicName");
          }}
        />
      </div>
      <div className="mb-4">
        <Select
          label="Clinic type"
          placeholder="Select clinic type"
          value={form.clinicType}
          error={errors.clinicType}
          options={typeOptions}
          onChange={(e) => {
            set("clinicType", e.target.value);
            clearError("clinicType");
          }}
        />
      </div>
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 mb-1.5 block">
          About your clinic{" "}
          <span className="text-xs font-light text-slate-400 ml-1">
            (optional)
          </span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Briefly describe what your clinic does and who you serve..."
          className="w-full px-4 py-3 text-sm bg-sand-50 border border-sand-200 rounded-xl outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/10 resize-vertical min-h-[80px] font-body placeholder:text-slate-300 placeholder:font-light"
        />
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <Input
          label="Year established"
          optional
          placeholder="e.g. 2008"
          value={form.yearEstablished}
          onChange={(e) => set("yearEstablished", e.target.value)}
        />
        <Input
          label="Number of beds"
          optional
          placeholder="e.g. 20"
          value={form.beds}
          onChange={(e) => set("beds", e.target.value)}
        />
      </div>
    </div>
  );
}

function ClinicStep2({ form, errors, set, clearError, stateOptions }: any) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.08em] uppercase mb-1.5">
        Step 2 of 5
      </p>
      <h2 className="font-display text-[26px] text-teal-900 mb-2">
        Where are you located?
      </h2>
      <p className="text-[14px] font-light text-slate-400 mb-7">
        Patients will use this to find and reach you.
      </p>
      <div className="mb-4">
        <Select
          label="State"
          placeholder="Select state"
          value={form.state}
          error={errors.state}
          options={stateOptions}
          onChange={(e) => {
            set("state", e.target.value);
            clearError("state");
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3.5 mb-4">
        <Input
          label="LGA"
          placeholder="e.g. Gbagada"
          value={form.lga}
          onChange={(e) => set("lga", e.target.value)}
        />
        <Input
          label="City"
          placeholder="e.g. Lagos"
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Input
          label="Street address"
          placeholder="14 Hospital Road, Gbagada"
          value={form.address}
          error={errors.address}
          onChange={(e) => {
            set("address", e.target.value);
            clearError("address");
          }}
        />
      </div>
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-600 mb-1.5">
          Clinic phone number
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
      <div className="grid grid-cols-2 gap-3.5">
        <Input
          label="Email"
          optional
          type="email"
          placeholder="info@yourclinic.ng"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <Input
          label="Website"
          optional
          type="url"
          placeholder="https://"
          value={form.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>
    </div>
  );
}

function ClinicStep3({ form, errors, toggleArr }: any) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.08em] uppercase mb-1.5">
        Step 3 of 5
      </p>
      <h2 className="font-display text-[26px] text-teal-900 mb-2">
        What services do you offer?
      </h2>
      <p className="text-[14px] font-light text-slate-400 mb-6">
        Select all that apply. Patients filter by these when searching for care.
      </p>
      {errors.services && (
        <p className="text-xs text-red-600 mb-3">{errors.services}</p>
      )}

      <p className="text-xs font-medium text-slate-600 mb-2">
        Services & specialties
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {CLINIC_SERVICES.map((s) => (
          <button
            key={s}
            onClick={() => toggleArr("services", s)}
            className={`px-3.5 py-1.5 rounded-full border text-[12px] font-medium cursor-pointer transition-all ${form.services.includes(s) ? "border-teal-600 bg-teal-50 text-teal-700" : "border-sand-200 bg-sand-50 text-slate-600 hover:border-teal-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <p className="text-xs font-medium text-slate-600 mb-2">
        Insurance accepted{" "}
        <span className="text-xs font-light text-slate-400 ml-1">
          (optional)
        </span>
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {INSURANCE_PROVIDERS.map((s) => (
          <button
            key={s}
            onClick={() => toggleArr("insurance", s)}
            className={`px-3.5 py-1.5 rounded-full border text-[12px] font-medium cursor-pointer transition-all ${form.insurance.includes(s) ? "border-teal-600 bg-teal-50 text-teal-700" : "border-sand-200 bg-sand-50 text-slate-600 hover:border-teal-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <p className="text-xs font-medium text-slate-600 mb-2">
        Languages spoken{" "}
        <span className="text-xs font-light text-slate-400 ml-1">
          (optional)
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((s) => (
          <button
            key={s}
            onClick={() => toggleArr("languages", s)}
            className={`px-3.5 py-1.5 rounded-full border text-[12px] font-medium cursor-pointer transition-all ${form.languages.includes(s) ? "border-teal-600 bg-teal-50 text-teal-700" : "border-sand-200 bg-sand-50 text-slate-600 hover:border-teal-200"}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function ClinicStep4({ form, errors, set, clearError }: any) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.08em] uppercase mb-1.5">
        Step 4 of 5
      </p>
      <h2 className="font-display text-[26px] text-teal-900 mb-2">
        Set up your admin account
      </h2>
      <p className="text-[14px] font-light text-slate-400 mb-7">
        This is the primary account that will manage the clinic.
      </p>
      <div className="grid grid-cols-2 gap-3.5 mb-4">
        <Input
          label="First name"
          placeholder="Chidi"
          value={form.adminFirstName}
          error={errors.adminFirstName}
          onChange={(e) => {
            set("adminFirstName", e.target.value);
            clearError("adminFirstName");
          }}
        />
        <Input
          label="Last name"
          placeholder="Okafor"
          value={form.adminLastName}
          error={errors.adminLastName}
          onChange={(e) => {
            set("adminLastName", e.target.value);
            clearError("adminLastName");
          }}
        />
      </div>
      <div className="mb-4">
        <Input
          label="Work email"
          type="email"
          placeholder="chidi@yourclinic.ng"
          value={form.adminEmail}
          error={errors.adminEmail}
          hint="You'll use this to sign in to your dashboard"
          onChange={(e) => {
            set("adminEmail", e.target.value);
            clearError("adminEmail");
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3.5 mb-4">
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={form.adminPassword}
          error={errors.adminPassword}
          onChange={(e) => {
            set("adminPassword", e.target.value);
            clearError("adminPassword");
          }}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          value={form.adminPassword2}
          error={errors.adminPassword2}
          onChange={(e) => {
            set("adminPassword2", e.target.value);
            clearError("adminPassword2");
          }}
        />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-600 mb-2">
          Your role at the clinic
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Clinic owner",
            "Medical director",
            "Practice manager",
            "Administrator",
          ].map((r) => (
            <button
              key={r}
              onClick={() => set("adminRole", r)}
              className={`px-3.5 py-1.5 rounded-full border text-[12px] font-medium cursor-pointer transition-all ${form.adminRole === r ? "border-teal-600 bg-teal-50 text-teal-700" : "border-sand-200 bg-sand-50 text-slate-600 hover:border-teal-200"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClinicStep5({ form, errors, set }: any) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.08em] uppercase mb-1.5">
        Step 5 of 5
      </p>
      <h2 className="font-display text-[26px] text-teal-900 mb-2">
        Review & go live
      </h2>
      <p className="text-[14px] font-light text-slate-400 mb-6">
        Check everything below before launching your clinic on Aláfíà.
      </p>

      {[
        {
          title: "Clinic details",
          fields: [
            ["Name", form.clinicName],
            ["Type", form.clinicType || "—"],
          ],
        },
        {
          title: "Location & contact",
          fields: [
            ["State", form.state || "—"],
            ["Address", form.address || "—"],
            ["Phone", `+234 ${form.phone}`],
            ["Email", form.email || "—"],
          ],
        },
        {
          title: "Admin account",
          fields: [
            ["Name", `${form.adminFirstName} ${form.adminLastName}`],
            ["Email", form.adminEmail || "—"],
            ["Role", form.adminRole || "—"],
          ],
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

      {form.services.length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-teal-600 tracking-[0.07em] uppercase mb-2.5 pb-2 border-b border-sand-200">
            Services
          </p>
          <div className="flex flex-wrap gap-1.5">
            {form.services.map((s: string) => (
              <span
                key={s}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

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
          I confirm that the information above is accurate and that I am
          authorised to register this clinic on Aláfíà. I agree to the Terms of
          Service and Privacy Policy.
        </p>
      </div>
      {errors.consent && (
        <p className="text-xs text-red-600">{errors.consent}</p>
      )}
    </div>
  );
}

function ClinicSuccessScreen({
  clinicId,
  name,
}: {
  clinicId: string;
  name: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-[440px] w-full text-center">
        <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-100 flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-teal-600" strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-[30px] text-teal-900 mb-2.5">
          Your clinic is live!
        </h2>
        <p className="text-[15px] font-light text-slate-400 leading-[1.7] mb-8">
          Welcome to Aláfíà.{" "}
          <strong className="font-medium text-slate-700">{name}</strong> is now
          visible to patients in your area.
        </p>
        <div className="bg-teal-800 rounded-2xl p-6 flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] font-medium text-teal-200 tracking-wide uppercase mb-1.5">
              Clinic ID
            </p>
            <p className="font-display text-[22px] text-white tracking-[1.5px]">
              {clinicId}
            </p>
            <p className="text-[11px] font-light text-white/40 mt-1">
              Use this ID when contacting support
            </p>
          </div>
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
        <div className="bg-sand-50 border border-sand-200 rounded-[18px] p-5 mb-6 text-left">
          <p className="text-[12px] font-semibold text-teal-600 tracking-wide uppercase mb-3.5">
            What happens next
          </p>
          {[
            "Our team will verify your clinic details within 24 hours.",
            "Once verified, patients in your area can find and book appointments.",
            "You'll receive an email with your dashboard login and a setup guide.",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 text-[13px] text-slate-600 mb-2.5 last:mb-0"
            >
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {item}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          <Button variant="primary" size="lg" fullWidth asChild>
            <a href="/clinic">Go to my clinic dashboard</a>
          </Button>
          <Button variant="outline" size="lg" fullWidth asChild>
            <a href="/clinic/team">Invite team members</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
