# Reward Management System - Full Technical Specification

This document provides the final structure for all schemas and APIs required to build the reward ecosystem.

## 1. Database Schemas (Detailed)

### A. Student (Existing `User` Collection)
> [!NOTE]
> We will enhance your current `User` schema.
- **pointsBalance**: `Number` (Redeemable points; resets every semester).
- **lifetimePoints**: `Number` (Total points earned; determines badges; never resets).
- **lastResetDate**: `Date` (Tracks when the points were last cleared).
- **badges**: `Array` (List of badge IDs or names earned).

### B. Staff (New Collection)
> [!IMPORTANT]
> Admins and Instructors dwell here. No OTP required.
- **name**, **email**, **password**
- **role**: `['admin', 'instructor']`
- **collegeName**: `String` (e.g., KCE, KIT, KAHE)
- **department**: `String`

### C. Semester Configuration (`SemesterConfig`)
> [!TIP]
> This handles the different dates for your 3 colleges and 4 batches.
- **collegeName**: `String`
- **batch**: `String` (e.g., 2024-2028)
- **semester**: `Number` (1-8)
- **startDate**: `Date`
- **endDate**: `Date`

### D. Achievement Submission (`AchievementSubmission`)
- **studentId**: `ObjectId` (Ref: User)
- **title**, **category**, **description**
- **evidenceUrl**: `String` (Link to file/image)
- **status**: `['pending', 'approved', 'rejected']`
- **pointsAwarded**: `Number`
- **createdAt**: `Date`

### E. Reward Catalog (`RewardCatalog`)
- **name**, **description**, **pointsCost**
- **stock**: `Number`
- **category**: `['Merchandise', 'Privilege', 'Digital']`

### F. Redemption History (`Redemption`)
- **studentId**: `ObjectId` (Ref: User)
- **rewardId**: `ObjectId` (Ref: RewardCatalog)
- **status**: `['pending', 'delivered']`
- **redeemedAt**: `Date`

---

## 2. API Endpoint List

### 🗓️ Semester Management (Admin Only)
- `POST /api/semester`: Add new semester dates for a college/batch.
- `PUT /api/semester/:id`: Edit existing dates.
- `GET /api/semester`: List all configurations.

### 👤 Staff Management (Admin Only)
- `POST /api/staff`: Add new Instructor or Admin.
- `GET /api/staff`: List all staff members.

### 🎁 Reward Catalog (Admin Only)
- `POST /api/rewards/catalog`: Add new reward item.
- `GET /api/rewards/catalog`: List all items for management.

### ✅ Achievement & Points
- `POST /api/achievements/submit`: (Student) Post achievement for approval.
- `PATCH /api/achievements/approve/:id`: (Staff) Approve post and assign points.
- `POST /api/points/assign`: (Admin) Manually add points to a student by Roll No.

### 📊 Student Dashboard (Self-Tracking)
- `GET /api/student/points`: View current balance and badge.
- `GET /api/student/posts`: View history of all achievement submissions.
- `GET /api/student/redemptions`: View history of all rewards redeemed.

---

## 3. Workflow Logic: Semester Reset
When a student visits their dashboard:
1. System checks their `collegeName` and `batch`.
2. Finds the active `SemesterConfig`.
3. If current date > `startDate` of the newest semester AND `lastResetDate` is before that `startDate`:
   - `pointsBalance` is set to `0`.
   - `lastResetDate` is updated to Today.
   - **Note**: `lifetimePoints` and `badges` are preserved.
