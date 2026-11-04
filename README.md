# PLV-CLIMS — Ionic Angular (frontend-only demo)

**18 routed screens · Student / Technical Representative / Administrator · responsive layout · Capacitor Android**

This package is a complete **source project** based on the supplied 18-screen SVG wireframe and the visual mood board in `reference/`. It uses the supplied mood-board logo in `src/assets/clims-logo.png`, blue `#2012B4`, orange `#F88709`, Libre Franklin and Poppins.

## A. What you need (Windows)

- Node.js 22.12+ or a compatible Node 24 release and npm.
- Android Studio with a working Android SDK and emulator or USB-debugging phone for Android tests.
- Internet access for the **first** npm package installation, and optionally for the Google Fonts used by the design.
- No XAMPP, PHP, MySQL, Firebase or Supabase is required.

## B. Run in a browser

1. Extract the ZIP.
2. Open Windows PowerShell or VS Code Terminal in the extracted **`PLV-CLIMS-Ionic`** folder.
3. Verify tools:

   ```powershell
   node -v
   npm -v
   ```

4. Install dependencies:

   ```powershell
   npm install
   ```

5. Run source checks, then launch development server:

   ```powershell
   npm run check:source
   npm start
   ```

6. Visit **http://localhost:4200**. Resize browser to 360–412px or use device emulation for mobile layout.

## C. Demo login accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@plv.edu.ph` | `Student123!` |
| Technical representative | `tech@plv.edu.ph` | `Tech123!` |
| Administrator | `admin@plv.edu.ph` | `Admin123!` |

**Important:** Login is a local UI demo only. Passwords are stored as clear-text sample data in local browser storage and must NOT be used as production authentication. "Forgot password" directly changes the local demo password without verification or sending email.

## D. Build for Android (Capacitor 8)

After running `npm install`:

```powershell
npm run build
npx cap add android
```

**Android native scanner requirement:** Open `android/variables.gradle` and ensure `minSdkVersion = 26` (the `@capacitor/barcode-scanner` plugin requires Android 8/API 26 or higher). Keep all other generated Gradle values.

Then:

```powershell
npx cap sync android
npx cap open android
```

In Android Studio, select an emulator/device and press **Run**. For real phone USB tests, enable Developer Options and USB Debugging, connect the phone, then select it in Android Studio. After later code changes run:

```powershell
npm run build
npx cap sync android
```

Alternatively, run `npm run android` after the Android platform was already added.

## E. Routes (18 pages)

| Screen | Route | Access |
|---|---|---|
| Login | `/login` | Guest |
| Student Dashboard | `/student/dashboard` | Student |
| Laboratories | `/student/laboratories` | All signed-in roles |
| Laboratory Layout | `/student/laboratories/:labId` | All signed-in roles |
| Computer Details | `/student/computers/:id` | All signed-in roles |
| Announcements | `/announcements` | All signed-in roles |
| My Account | `/account` | All signed-in roles |
| Technical Dashboard | `/technical/dashboard` | Technical |
| Computer Inspection | `/technical/inspection` | Technical |
| Ticket List | `/technical/tickets` | Technical, Admin |
| Create Ticket | `/technical/tickets/new` | Technical |
| Ticket Details | `/tickets/:id` | Technical, Admin |
| Maintenance | `/technical/maintenance` | Technical (view), Admin (record) |
| Inspection History | `/technical/history` | Technical, Admin |
| User Management | `/admin/users` | Admin |
| Laboratory Management | `/admin/laboratories` | Admin |
| Announcements & Reports | `/admin/reports` | Admin |
| Settings & Audit Logs | `/admin/settings` | Admin |

**Route note:** Routes are role-protected. Student users cannot change status, manage equipment or create tickets. Technical Representatives record observations and issue reports but do not repair equipment or resolve tickets. Admin can update ticket status and coordinate externally completed maintenance.

## F. Try the full demo flow

1. Sign in as Technical Representative; select **Tickets → Create Ticket**; choose laboratory, PC and category; write a description. Use **Check for duplicates**; save the ticket.
2. Open the ticket from **Ticket List**, add an observation and see the activity timeline change.
3. Sign out and enter the Administrator account; open **Tickets**, edit the ticket's status and assignment.
4. Open **Laboratory Management**; select a PC and change its recorded status; verify the tile updates in the map.
5. To change tile order, select **Edit computer layout**, then select two tiles to swap their positions.
6. Create an announcement and export a CSV or PDF from **Announcements & Reports**.
7. Sign in as Student and verify that laboratories, PC statuses and announcements display while editing/report creation stays unavailable.
8. Reload the page: changes persist in `localStorage` on the same browser/device.
9. Use **Settings & Audit Logs → Export local backup** before **Reset Demo Data**.

## G. How the local demonstration works

- `src/app/core/models.ts` — typed entities and role names.
- `src/app/core/mock-data.ts` — initial sample data (8 laboratories, computers, tickets, users and announcements).
- `src/app/core/data.service.ts` — reactive Angular signal store backed by `localStorage`.
- `src/app/core/auth.service.ts` — demo login, role state, Remember Me and inactivity logout.
- `src/app/core/guards.ts` — route permissions.
- `src/app/shared/page-header.component.ts` — consistent header and functional global record search.
- `src/app/shared/files.ts` — image import, CSV and PDF export; uses native file/share on Android.
- `src/app/pages/*` — **all 18 pages**, each with a standalone `.page.ts`, `.page.html` and `.page.scss`.
- `src/global.scss` — colors, type, button states, cards and responsive styling.
- `reference/` — original user-provided wireframe and mood board for comparison.

### QR scanner

On Android the **Capacitor Barcode Scanner** opens a real native scanner, not a simulated success message. QR content should be the full computer ID such as `LAB-01-PC-08`. On browser, scanning uses `BarcodeDetector` and camera access if available. If camera scanning is unavailable, the **Select computer** field still works as a manual fallback. For native Android, set `minSdkVersion` to 26 as shown above.

### Demo limitations

- Local data cannot sync between users, browsers or devices; there is no server.
- Role guards protect **demo navigation only**, not real confidential data.
- No email sending, push notifications, live cross-user updates or production-grade audit integrity.
- Small photo evidence and profile images are stored as Data URLs and limited to 650 KB each to avoid exceeding browser storage.
- The fonts are loaded via Google Fonts; if your Android is offline, system fallbacks apply.
- Android's native project folder is generated on *your computer* by `npx cap add android`, not included in this ZIP.
- Reports are made from sample/local data and may be exported as CSV or PDF.

## H. Troubleshooting

- **`ng` missing:** run `npm install` in the project root; `npm start` uses local CLI from `node_modules`.
- **`npm` fails because of network:** confirm internet access, check proxy settings and retry `npm install`.
- **`Missing android platform`:** run `npx cap add android` once after `npm run build`.
- **Native scanner build error:** ensure `android/variables.gradle` has `minSdkVersion = 26`, then `npx cap sync android`.
- **Blank screen after editing files:** check the terminal `npm start` output for Angular compilation errors.
- **Data is inconsistent:** sign in as Administrator, export a backup, then use **Reset Demo Data**.

## I. Verification status

The source package includes `npm run check:source`, which checks TypeScript syntax, the 18 route targets and existence of TS/HTML/SCSS files. **Angular/Android compilation has not been executed in this file-generation environment**, because npm package installation cannot reach the registry here. Run `npm install`, `npm run build`, and Android Studio on your computer for the required compile/runtime tests. Do not treat source checks alone as successful Android testing.
