import { describe, expect, it } from "vitest";
import {
  clinicRegisterSchema,
  loginSchema,
  patientRegisterSchema,
  roleSchema,
} from "./validations";

describe("auth validation schemas", () => {
  it("accepts supported account roles", () => {
    expect(roleSchema.parse("PATIENT")).toBe("PATIENT");
    expect(roleSchema.parse("CLINIC_ADMIN")).toBe("CLINIC_ADMIN");
  });

  it("rejects unsupported account roles", () => {
    expect(roleSchema.safeParse("DOCTOR").success).toBe(false);
  });

  it("requires a valid login email and an eight-character password", () => {
    expect(
      loginSchema.safeParse({
        email: "patient@example.com",
        password: "password123",
      }).success,
    ).toBe(true);

    expect(
      loginSchema.safeParse({
        email: "not-an-email",
        password: "short",
      }).success,
    ).toBe(false);
  });

  it("validates patient registration payloads", () => {
    expect(
      patientRegisterSchema.safeParse({
        email: "patient@example.com",
        password: "password123",
        firstName: "Amaka",
        lastName: "Obi",
        phone: "+2348012345678",
      }).success,
    ).toBe(true);

    expect(
      patientRegisterSchema.safeParse({
        email: "patient@example.com",
        password: "password123",
        firstName: "",
        lastName: "Obi",
      }).success,
    ).toBe(false);
  });

  it("validates clinic registration payloads", () => {
    expect(
      clinicRegisterSchema.safeParse({
        email: "admin@clinic.example",
        password: "password123",
        clinicName: "Alafia Clinic",
        address: "123 Hospital Road",
      }).success,
    ).toBe(true);

    expect(
      clinicRegisterSchema.safeParse({
        email: "admin@clinic.example",
        password: "password123",
        clinicName: "A",
      }).success,
    ).toBe(false);
  });
});
