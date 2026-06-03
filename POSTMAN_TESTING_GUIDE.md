# Postman API Testing Guide for Alafia

## Setup

1. **Import Environment Variables** in Postman:
   - Set `BASE_URL` = `http://localhost:3000`
   - Set `TOKEN` = (will be auto-filled after login)
   - Set `CLINIC_ID` = (will be auto-filled after clinic registration)
   - Set `PATIENT_ID` = (will be auto-filled after patient registration)
   - Set `STAFF_ID` = (will be auto-filled after staff creation)

---

## 1. Authentication Endpoints

### Register as Patient

```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "role": "PATIENT",
  "email": "patient@test.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1995-04-12",
  "phone": "+1234567890"
}
```

**Response:** User registered, cookie set automatically

---

### Register as Clinic

```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "role": "CLINIC_ADMIN",
  "email": "clinic@test.com",
  "password": "password123",
  "clinicName": "Test Clinic",
  "address": "123 Main St",
  "phone": "+1234567890",
  "licenseNumber": "LIC123456"
}
```

**Response:** Clinic registered, saves CLINIC_ID from response

**Duplicate check:** Reusing the same email returns `409 Email already exists`. Reusing the same `licenseNumber` returns `409 Clinic already exists`.

---

### Login

```
POST {{BASE_URL}}/api/auth/login
Content-Type: application/json

{
  "email": "clinic@test.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "role": "CLINIC_ADMIN",
  "redirectTo": "/dashboard/clinic"
}
```

Cookie is set automatically. Save the token for later use if needed.

Use one of these auth modes for later requests:

- **Cookie auth:** set Authorization to `No Auth` and let Postman send the stored cookie automatically.
- **Bearer auth:** set Authorization type to `Bearer Token` and paste the raw JWT only in `{{TOKEN}}`.
- Do not paste `Bearer ` into the token field, and do not wrap the token in quotes.
- If both are present, the `Authorization` header wins, so a stale `{{TOKEN}}` can override a fresh cookie.

---

## 2. Clinic Staff Management

### Get All Staff

```
GET {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/staff
Authorization: Bearer {{TOKEN}}
```

---

### Create Doctor

```
POST {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/staff
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "email": "doctor@test.com",
  "password": "password123",
  "role": "DOCTOR",
  "specialization": "Cardiology",
  "qualifications": "MD, Board Certified",
  "bio": "Experienced cardiologist",
  "consultationFee": 150.00
}
```

Save the returned `staff.id` as `STAFF_ID`. Do not use `staff.user.id`.

---

### Create Clinic Staff

```
POST {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/staff
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "email": "staff@test.com",
  "password": "password123",
  "role": "CLINIC_STAFF"
}
```

---

## 3. Working Hours Management

### Get Doctor Working Hours

```
GET {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/staff/{{STAFF_ID}}/working-hours
Authorization: Bearer {{TOKEN}}
```

---

### Set Doctor Working Hours

Use the `PUT` method here. If you get `405 Method Not Allowed`, double-check that Postman is not still set to `GET` or `POST`, and that the URL includes the full `/staff/{STAFF_ID}/working-hours` path.

```
PUT {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/staff/{{STAFF_ID}}/working-hours
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "schedule": [
    {
      "dayOfWeek": 1,
      "startTime": "08:00",
      "endTime": "17:00",
      "isActive": true
    },
    {
      "dayOfWeek": 2,
      "startTime": "08:00",
      "endTime": "17:00",
      "isActive": true
    },
    {
      "dayOfWeek": 3,
      "startTime": "08:00",
      "endTime": "17:00",
      "isActive": true
    }
  ]
}
```

---

## 4. Appointment Slots

### Generate Slots (from working hours)

```
POST {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/staff/{{STAFF_ID}}/slots/generate
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "fromDate": "2026-05-10",
  "toDate": "2026-05-17",
  "slotDurationMinutes": 30
}
```

---

### Get Available Slots

```
GET {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/staff/{{STAFF_ID}}/slots?date=2026-05-10
Authorization: Bearer {{TOKEN}}
```
all tests passed TILL THIS POINT 

---

## 5. Appointments

### Book Appointment (as Patient)

```
POST {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/appointments
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "patientId": "{{PATIENT_ID}}",
  "doctorId": "{{STAFF_ID}}",
  "slotId": "{{SLOT_ID}}",
  "reason": "Regular checkup"
}
```

---

### Get Clinic Appointments

```
GET {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/appointments
Authorization: Bearer {{TOKEN}}
```

**Query params:**

- `?status=PENDING`
- `?doctorId={{STAFF_ID}}`
- `?date=2026-05-10`

---

### Get Appointment Details

```
GET {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/appointments/{{APPOINTMENT_ID}}
Authorization: Bearer {{TOKEN}}
```

---

### Confirm Appointment

```
PATCH {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/appointments/{{APPOINTMENT_ID}}
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "action": "confirm"
}
```

---

### Complete Appointment

```
PATCH {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/appointments/{{APPOINTMENT_ID}}
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "action": "complete",
  "notes": "Patient responded well to treatment"
}
```

---

### Cancel Appointment

```
PATCH {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/appointments/{{APPOINTMENT_ID}}
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "action": "cancel",
  "cancelReason": "Patient request"
}
```

---

### Reschedule Appointment

```
PATCH {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/appointments/{{APPOINTMENT_ID}}
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "action": "reschedule",
  "newSlotId": "{{NEW_SLOT_ID}}"
}
```

---

### Mark as No Show

```
PATCH {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/appointments/{{APPOINTMENT_ID}}
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "action": "no_show"
}
```

---

### Add Notes to Appointment

```
PATCH {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/appointments/{{APPOINTMENT_ID}}
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "action": "add_notes",
  "notes": "Follow up in 2 weeks"
}
```

---

## 6. Patient Management

### Get Patient Profile

```
GET {{BASE_URL}}/api/patients/me
Authorization: Bearer {{TOKEN}}
```

---

### Update Patient Profile

```
PUT {{BASE_URL}}/api/patients/me
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+9876543210"
}
```

---

### Get Patient Appointments (as Patient)

```
GET {{BASE_URL}}/api/patients/me/appointments
Authorization: Bearer {{TOKEN}}
```

**Query params:**

- `?status=CONFIRMED`
- `?upcoming=true`

---

### Get Clinic Patients

```
GET {{BASE_URL}}/api/clinics/{{CLINIC_ID}}/patients
Authorization: Bearer {{TOKEN}}
```

**Query params:**

- `?search=john`
- `?page=1&limit=20`

---

## 7. Admin Utilities (Test Data Cleanup)

### Delete All Test Users (SUPER_ADMIN only)

```
DELETE {{BASE_URL}}/api/admin/cleanup/users
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "confirmation": "DELETE_ALL_USERS"
}
```

---

### Delete User by Email

```
DELETE {{BASE_URL}}/api/admin/cleanup/users
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "email": "test@example.com"
}
```

---

### Delete Clinic and Related Data

```
DELETE {{BASE_URL}}/api/admin/cleanup/clinics/{{CLINIC_ID}}
Authorization: Bearer {{TOKEN}}
```

---

### Delete All Test Data (Nuclear Option)

```
DELETE {{BASE_URL}}/api/admin/cleanup/all
Content-Type: application/json
Authorization: Bearer {{TOKEN}}

{
  "confirmation": "DELETE_ALL_DATA"
}
```

---

## Testing Workflow

1. **Create test clinic account** → Save CLINIC_ID
2. **Login with clinic** → Verify token in cookie
3. **Create doctor** → Save STAFF_ID
4. **Set working hours** → Use doctor STAFF_ID
5. **Generate slots** → Create availability
6. **Create patient account** → Save PATIENT_ID
7. **Book appointment** → Use patient STAFF_ID
8. **Confirm/Complete** → Test all appointment actions
9. **Cleanup** → Use admin endpoints to delete test data

---

## Important Notes

- **Cookies:** Postman auto-stores cookies after login
- **Roles:** Different endpoints require different roles
- **Clinic Access:** SUPER_ADMIN can access any clinic; others only see their own
- **Patient Isolation:** Patients only see/modify their own data
- **Doctor Isolation:** Doctors only see their own appointments
