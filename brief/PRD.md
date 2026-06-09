# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Juara PettyCash — Petty Cash Management System
**Versi:** V1.0
**Revisi Terakhir:** Juni 2026
**Pemilik Produk:** JEF GROUP ID

---

## DAFTAR ISI
1. Informasi Produk
2. Latar Belakang & Problem Statement
3. Tujuan Produk & Success Metrics
4. Struktur Pengguna & RBAC
5. Workflow Bisnis
6. Arsitektur Sistem
7. Teknologi Stack
8. Design System & UI Specification
9. Struktur Routing & Halaman
10. Modul Sistem (Detail)
11. Struktur Database (Google Sheets)
12. API & Backend Specification (GAS)
13. Non-Functional Requirements
14. Relasi Data
15. Security & Compliance
16. Notification System
17. Deployment & DevOps
18. Risiko & Mitigasi
19. Roadmap

---

## 1. INFORMASI PRODUK

| Informasi | Detail |
|---|---|
| Nama Produk | Juara PettyCash |
| Jenis Aplikasi | Web Application (SPA) |
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (TSX) |
| Backend | Google Apps Script (GAS) |
| Database | Google Spreadsheet |
| Storage Dokumen | Google Drive |
| Authentication | Google OAuth 2.0 (Workspace) |
| Versi | V1.0 |
| Pemilik Produk | JEF GROUP ID |
| URL Pattern | `domain/namahalaman` (clean URL) |

---

## 2. LATAR BELAKANG & PROBLEM STATEMENT

### 2.1 Kondisi Saat Ini (As-Is)
Pengelolaan kas kecil JEF GROUP saat ini dilakukan secara manual dengan:
- Spreadsheet terpisah per divisi tanpa sinkronisasi real-time
- Dokumen fisik sebagai bukti transaksi
- Komunikasi approval via WhatsApp/email yang tidak terlacak
- Laporan dibuat manual setiap akhir bulan

### 2.2 Pain Points Teridentifikasi

| # | Pain Point | Dampak | Severity |
|---|---|---|---|
| 1 | Saldo tidak bisa dipantau real-time | Risiko overdraft kas | High |
| 2 | Approval lambat (2–5 hari kerja) | Operasional terhambat | High |
| 3 | Bukti transaksi tersebar/hilang | Gagal audit | High |
| 4 | Duplikasi pencatatan | Data tidak akurat | Medium |
| 5 | Tidak ada audit trail | Tidak bisa investigasi | High |
| 6 | Laporan butuh effort manual | Waste 8–16 jam/bulan | Medium |

### 2.3 Solusi
Juara PettyCash hadir sebagai sistem terpusat berbasis web yang mendigitalisasi seluruh lifecycle kas kecil — dari pengajuan, approval, pencairan, pengeluaran, settlement, hingga replenishment — dengan audit trail lengkap dan laporan otomatis.

---

## 3. TUJUAN PRODUK & SUCCESS METRICS

### 3.1 Business Goals
- Transparansi 100% penggunaan dana kas kecil lintas divisi
- Mempercepat proses approval dari rata-rata 3 hari → < 1 hari kerja
- Eliminasi kesalahan pencatatan duplikat
- Audit internal/eksternal dapat dilakukan mandiri tanpa persiapan manual
- Monitoring saldo real-time untuk semua level manajemen

### 3.2 Success Metrics (KPI)

| KPI | Baseline (Sekarang) | Target V1.0 | Cara Ukur |
|---|---|---|---|
| Digitalisasi transaksi | ~20% | 100% | Jumlah entry digital / total transaksi |
| Waktu approval | 2–5 hari kerja | < 1 hari kerja | Rata-rata waktu submit → approved |
| Akurasi laporan | ~85% | > 99% | Error rate laporan bulanan |
| Pengurangan proses manual | 0% | > 80% | Jam kerja admin manual / bulan |
| Dokumentasi digital | ~30% | 100% | Bukti transaksi terupload / total transaksi |
| User adoption | N/A | > 90% DAU | Active users / total users terdaftar |

---

## 4. STRUKTUR PENGGUNA & RBAC

### 4.1 Role Hierarchy

```
Direktur
  └── Head Manager (per divisi)
        └── Admin Finance (per divisi)
```

### 4.2 Permission Matrix

| Fitur | Direktur | Head Manager | Admin Finance |
|---|:---:|:---:|:---:|
| **DASHBOARD** | | | |
| Dashboard perusahaan (all divisi) | ✅ | ❌ | ❌ |
| Dashboard divisi | ✅ | ✅ | ✅ |
| **PENGAJUAN DANA** | | | |
| Buat pengajuan | ❌ | ❌ | ✅ |
| Approval (dalam limit HM) | ❌ | ✅ | ❌ |
| Approval (di atas limit HM) | ✅ | ❌ | ❌ |
| **PENGELUARAN** | | | |
| Input pengeluaran | ❌ | ❌ | ✅ |
| Upload bukti transaksi | ❌ | ❌ | ✅ |
| Review pengeluaran | ❌ | ✅ | ❌ |
| **SETTLEMENT** | | | |
| Buat settlement | ❌ | ❌ | ✅ |
| Approval settlement | ❌ | ✅ | ❌ |
| **REPLENISHMENT** | | | |
| Ajukan replenishment | ❌ | ❌ | ✅ |
| Approval replenishment | ❌ | ✅ | ❌ |
| Final approval replenishment | ✅ | ❌ | ❌ |
| **LAPORAN** | | | |
| Laporan divisi sendiri | ✅ | ✅ | ✅ |
| Laporan semua divisi | ✅ | ❌ | ❌ |
| Export PDF/Excel | ✅ | ✅ | ✅ |
| **MASTER DATA** | | | |
| Kelola pengguna | ✅ | ❌ | ❌ |
| Kelola kategori | ✅ | ✅ | ❌ |
| **AUDIT TRAIL** | | | |
| Lihat audit trail | ✅ | ✅ (divisi) | ❌ |
| **PENGATURAN SISTEM** | | | |
| Edit pengaturan sistem | ✅ | ❌ | ❌ |

### 4.3 Data Model Pengguna

```typescript
interface User {
  id: string;               // Format: USR-001
  name: string;
  email: string;            // Google Workspace email
  position: string;         // Jabatan
  role: 'direktur' | 'head_manager' | 'admin_finance';
  division: string;         // Divisi/Departemen
  status: 'active' | 'inactive';
  createdAt: string;        // ISO 8601
  lastLogin: string;        // ISO 8601
}
```

---

## 5. WORKFLOW BISNIS

### 5.1 Pengajuan Dana

```
Admin Finance
  → [Buat Draft Pengajuan]
  → [Submit]
  → Head Manager: Review
      ├── Nominal ≤ Limit HM → [Approve HM] → Dana Disetujui
      ├── Nominal > Limit HM → [Teruskan ke Direktur]
      │     ├── [Approve Direktur] → Dana Disetujui
      │     └── [Reject Direktur] → Notifikasi Admin
      └── [Reject HM] → Notifikasi Admin / [Request Revision]
  → [Pencairan Dana] → Saldo Berkurang
```

**Status Flow:** `draft` → `pending_hm` → `pending_direktur` *(opsional)* → `approved` | `rejected` → `disbursed`

### 5.2 Input Pengeluaran

```
Admin Finance
  → [Input Pengeluaran + Upload Bukti]
  → Validasi Sistem (nominal > 0, saldo cukup, bukti ada)
  → [Submit]
  → Head Manager: Review
      ├── [Approve] → Saldo Dikurangi, Log Dicatat
      └── [Reject] → Notifikasi Admin
```

**Status Flow:** `draft` → `pending_review` → `approved` | `rejected`

### 5.3 Pertanggungjawaban (Settlement)

```
Admin Finance
  → [Buat Settlement] (referensi ke Pengajuan Dana)
  → Input detail pengeluaran + bukti per item
  → [Submit]
  → Head Manager: Review
      ├── Dana Diterima = Total Pengeluaran → [Approve] → Selesai
      ├── Dana Diterima > Total Pengeluaran → Sisa dikembalikan → [Approve]
      └── [Reject] → Notifikasi / Revisi
```

**Status Flow:** `draft` → `pending_review` → `approved` | `rejected`

### 5.4 Replenishment

```
Admin Finance
  → [Ajukan Replenishment] (triggered: saldo < minimum threshold)
  → Head Manager: Review & Approve
  → Direktur: Final Approval
  → [Saldo Ditambahkan] → Log Replenishment
```

**Status Flow:** `pending_hm` → `pending_direktur` → `approved` | `rejected` → `completed`

### 5.5 State Diagram Saldo

```
Saldo Awal (Replenishment)
  ↓ [Pengajuan Disetujui + Dicairkan]
Saldo Berkurang (Uang di tangan Admin)
  ↓ [Pengeluaran Diinput + Diapprove]
Saldo Berkurang (Uang keluar ke vendor)
  ↓ [Settlement Diapprove]
Saldo Final Tercatat
  ↓ [Saldo < Minimum] → Trigger Replenishment
```

---

## 6. ARSITEKTUR SISTEM

### 6.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                       │
│   Next.js 14 (App Router) + TypeScript + Tailwind CSS   │
│   Deployed: Vercel / Self-hosted                         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS (fetch / axios)
                       │ REST-like endpoints via GAS doGet/doPost
┌──────────────────────▼──────────────────────────────────┐
│              GOOGLE APPS SCRIPT (Backend)                │
│   - Web App URL (deployed as public/restricted)          │
│   - SpreadsheetApp, DriveApp, GmailApp                  │
│   - Session & Auth Handler                               │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
┌────────▼────────┐        ┌──────────▼────────┐
│ Google Sheets   │        │   Google Drive     │
│ (Database)      │        │   (File Storage)   │
└─────────────────┘        └───────────────────┘
```

### 6.2 Komponen Arsitektur

**Frontend (Next.js App Router):**
- Pages dirender sebagai Server Components atau Client Components sesuai kebutuhan
- State management: Zustand (global) + React Query (server state & caching)
- Authentication: NextAuth.js dengan Google Provider

**Backend (GAS):**
- Exposed sebagai Web App dengan endpoint REST-like
- `doGet(e)` → handler untuk GET requests
- `doPost(e)` → handler untuk POST/PUT/DELETE requests
- Router berbasis `action` parameter dalam payload

**Communication Pattern:**
```
Next.js → fetch(`GAS_URL?action=getTransactions&...`) → GAS doGet
Next.js → fetch(GAS_URL, { method: 'POST', body: JSON.stringify({action, data}) }) → GAS doPost
```

---

## 7. TEKNOLOGI STACK

### 7.1 Frontend

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| Framework | Next.js | 14.x (App Router) | SSR + CSR hybrid |
| Language | TypeScript | 5.x | Strict mode |
| Styling | Tailwind CSS | 3.x | Utility-first |
| UI Components | shadcn/ui | Latest | Accessible primitives |
| Icons | Lucide React | Latest | Konsisten |
| Charts | Recharts | 2.x | Dashboard analytics |
| Tables | TanStack Table | 8.x | Advanced data grid |
| Form | React Hook Form + Zod | Latest | Validasi schema-first |
| State (global) | Zustand | 4.x | Ringan, performant |
| State (server) | TanStack Query | 5.x | Caching + sync |
| Auth | NextAuth.js | 4.x | Google Provider |
| HTTP | Axios | 1.x | Interceptors |
| Date | date-fns | 3.x | Manipulasi tanggal |
| File Upload | react-dropzone | Latest | Drag & drop |
| PDF Export | @react-pdf/renderer | Latest | Generate PDF |
| Excel Export | xlsx (SheetJS) | Latest | Generate Excel |
| Notifications | react-hot-toast | Latest | Toast notifications |
| Animation | Framer Motion | 10.x | Micro-interactions |

### 7.2 Backend

| Layer | Teknologi | Keterangan |
|---|---|---|
| Runtime | Google Apps Script V8 | JavaScript Engine |
| Database | Google Spreadsheet | Via SpreadsheetApp |
| Storage | Google Drive | Via DriveApp |
| Email | Gmail Service | Via GmailApp |
| Auth Validation | Google OAuth Tokens | Validasi server-side |

### 7.3 DevOps & Tooling

| Tools | Keterangan |
|---|---|
| Deployment | Vercel (Frontend) |
| GAS Deployment | clasp CLI |
| Version Control | GitHub |
| Package Manager | pnpm |
| Linting | ESLint + Prettier |
| Testing | Jest + React Testing Library |
| Environment | `.env.local` via Vercel env vars |

---

## 8. DESIGN SYSTEM & UI SPECIFICATION

### 8.1 Design Philosophy
**Neo Modern SaaS Dashboard** dengan pendekatan:
- **Glassmorphism** — digunakan sedikit pada card overlay dan modal backdrop
- **Soft Neumorphism** — pada komponen interactive (tombol, input field)
- **Gradient UI** — sebagai aksent pada header, sidebar aktif, dan widget saldo
- **Fintech Dashboard** — typography presisi, data-density tinggi, warna terpercaya

### 8.2 Color System

```css
/* === DARK MODE (Default) === */
--bg-primary: #0D0F14;          /* Background utama */
--bg-secondary: #13161E;        /* Surface card */
--bg-tertiary: #1A1E2A;         /* Surface elevated */
--bg-glass: rgba(255,255,255,0.04);  /* Glassmorphism surface */
--border-subtle: rgba(255,255,255,0.08);

/* Brand Gradient */
--brand-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%);
--brand-primary: #6366F1;       /* Indigo — trust, finance */
--brand-secondary: #8B5CF6;     /* Violet — modern */
--brand-accent: #22D3EE;        /* Cyan — highlight */

/* Status Colors */
--status-success: #10B981;      /* Approved, positive */
--status-warning: #F59E0B;      /* Pending, review */
--status-danger: #EF4444;       /* Rejected, low balance */
--status-info: #3B82F6;         /* Informational */

/* Text */
--text-primary: #F1F5F9;
--text-secondary: #94A3B8;
--text-muted: #475569;

/* === LIGHT MODE === */
--bg-primary: #F8FAFC;
--bg-secondary: #FFFFFF;
--bg-tertiary: #F1F5F9;
--bg-glass: rgba(255,255,255,0.7);
--border-subtle: rgba(0,0,0,0.08);
--text-primary: #0F172A;
--text-secondary: #475569;
--text-muted: #94A3B8;
```

### 8.3 Typography

```css
/* Display (Angka besar, headline widget) */
font-family: 'Inter', 'DM Sans', sans-serif;
--font-display: 700, tracking: -0.02em

/* Body */
--font-body: 400/500, tracking: 0

/* Monospace (Nomor transaksi, kode) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;

/* Type Scale */
--text-xs: 11px
--text-sm: 13px
--text-base: 14px
--text-lg: 16px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 32px
--text-4xl: 40px
```

### 8.4 Component Specifications

#### Card (Glassmorphism)
```css
background: var(--bg-glass);
backdrop-filter: blur(12px);
border: 1px solid var(--border-subtle);
border-radius: 16px;
box-shadow: 0 4px 24px rgba(0,0,0,0.12);
```

#### Stat Widget (Gradient)
```css
background: var(--brand-gradient);
border-radius: 20px;
padding: 24px;
/* Inner glow effect */
box-shadow: 0 8px 32px rgba(99, 102, 241, 0.25);
```

#### Button Primary (Soft Neumorphism pada Light Mode)
```css
/* Light mode */
background: #FFFFFF;
box-shadow: 6px 6px 12px #D1D5DB, -6px -6px 12px #FFFFFF;
border-radius: 12px;

/* Dark mode — flat gradient */
background: var(--brand-gradient);
border-radius: 12px;
```

#### Sidebar
```css
width: 260px (expanded) / 72px (collapsed);
background: var(--bg-secondary);
border-right: 1px solid var(--border-subtle);
/* Active item */
background: var(--brand-gradient);
border-radius: 12px;
```

### 8.5 Dark/Light Mode Switch
- Disimpan di `localStorage` + `cookie` (untuk SSR)
- Toggle: floating button pojok kanan bawah + setting menu
- Transisi: `transition: all 300ms ease` pada semua elemen
- Default: sistem OS preference via `prefers-color-scheme`

### 8.6 Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Bottom nav, cards 1 col |
| Tablet | 640–1024px | Sidebar collapsed, 2 col |
| Desktop | > 1024px | Sidebar expanded, 3–4 col |

---

## 9. STRUKTUR ROUTING & HALAMAN

### 9.1 Route Map (Next.js App Router)

```
app/
├── (auth)/
│   └── login/                    → /login
├── (dashboard)/
│   ├── layout.tsx                → Shared sidebar + topbar
│   ├── dashboard/                → /dashboard
│   ├── pengajuan/
│   │   ├── page.tsx              → /pengajuan (List)
│   │   ├── baru/                 → /pengajuan/baru (Form)
│   │   └── [id]/                 → /pengajuan/[id] (Detail)
│   ├── pengeluaran/
│   │   ├── page.tsx              → /pengeluaran (List)
│   │   ├── baru/                 → /pengeluaran/baru (Form)
│   │   └── [id]/                 → /pengeluaran/[id] (Detail)
│   ├── settlement/
│   │   ├── page.tsx              → /settlement (List)
│   │   ├── baru/                 → /settlement/baru (Form)
│   │   └── [id]/                 → /settlement/[id] (Detail)
│   ├── replenishment/
│   │   ├── page.tsx              → /replenishment (List)
│   │   ├── baru/                 → /replenishment/baru (Form)
│   │   └── [id]/                 → /replenishment/[id] (Detail)
│   ├── approval/                 → /approval (Queue semua approval)
│   ├── laporan/
│   │   ├── transaksi/            → /laporan/transaksi
│   │   ├── pengeluaran/          → /laporan/pengeluaran
│   │   ├── settlement/           → /laporan/settlement
│   │   └── replenishment/        → /laporan/replenishment
│   ├── master/
│   │   ├── pengguna/             → /master/pengguna
│   │   └── kategori/             → /master/kategori
│   ├── audit/                    → /audit (Audit Trail)
│   └── pengaturan/               → /pengaturan (System Settings)
└── api/
    └── auth/[...nextauth]/       → NextAuth handler
```

### 9.2 Halaman Detail

#### `/login`
- Google OAuth button
- Company branding (logo JEF GROUP)
- Background: animated gradient mesh

#### `/dashboard`
Konten berbeda berdasarkan role (server-side role check):
- **Direktur:** All-company metrics, multi-divisi chart
- **Head Manager:** Divisi metrics, approval queue widget
- **Admin Finance:** Saldo saat ini, quick action buttons, transaksi terkini

#### `/pengajuan`
- Data table dengan filter: status, kategori, periode, divisi
- Quick status badge
- Action buttons per row: Lihat, Edit (jika draft), Submit

#### `/pengajuan/baru`
- Multi-step form: Informasi → Lampiran → Konfirmasi
- Auto-generate nomor pengajuan
- Real-time saldo preview

#### `/approval`
- Unified queue semua dokumen pending (pengajuan, pengeluaran, settlement, replenishment)
- Tab per jenis dokumen
- Bulk approve untuk Direktur

---

## 10. MODUL SISTEM (DETAIL)

### Modul 1 — Authentication & Session

**Alur Login:**
```
User → /login → Google OAuth popup → Token diterima NextAuth
→ GAS validasi email whitelist → Session dibuat → Redirect /dashboard
```

**Token Storage:**
- `NextAuth Session` (server-side cookie, httpOnly)
- Role di-fetch fresh dari GAS setiap session baru

**Middleware Protection:**
```typescript
// middleware.ts
export const config = {
  matcher: ['/((?!login|api/auth).*)'],
};
```

---

### Modul 2 — Dashboard

#### Widget Direktur
| Widget | Data Source | Update |
|---|---|---|
| Total Saldo Semua Divisi | Sheet: Saldo_Kas_Kecil | Real-time (on load) |
| Total Pengeluaran Bulan Ini | Sheet: Pengeluaran | Aggregated |
| Outstanding Approval | Sheet: Pengajuan + Persetujuan | Real-time |
| Approval Aging (> 1 hari) | Kalkulasi dari timestamp | Real-time |
| Grafik Pengeluaran Bulanan | Sheet: Pengeluaran (12 bulan) | Bar chart (Recharts) |
| Pengeluaran per Divisi | Sheet: Pengeluaran (group) | Donut chart |

#### Widget Head Manager
| Widget | Data |
|---|---|
| Pengajuan Menunggu Persetujuan | Count + list |
| Pengeluaran Divisi Bulan Ini | Total nominal |
| Outstanding Settlement | Count |
| Saldo Divisi | Real-time |

#### Widget Admin Finance
| Widget | Data |
|---|---|
| Saldo Saat Ini | Highlight (warna berdasarkan threshold) |
| Transaksi Hari Ini | Count + nominal |
| Pengajuan Pending | Count |
| Quick Actions | Tombol: Buat Pengajuan, Input Pengeluaran, Buat Settlement |

---

### Modul 3 — Master Data

#### 3a. Manajemen Pengguna (Direktur only)
- CRUD pengguna
- Assign role & divisi
- Activate/Deactivate akun
- Bulk import via CSV

#### 3b. Kategori Pengeluaran

**Kategori Default:**
```
KAT-001 | Transportasi      | Aktif
KAT-002 | Konsumsi          | Aktif
KAT-003 | ATK               | Aktif
KAT-004 | Operasional       | Aktif
KAT-005 | Maintenance       | Aktif
KAT-006 | Lain-lain         | Aktif
```

---

### Modul 4 — Pengajuan Dana

**Auto-Generate Nomor:** `PJD-{YYYYMMDD}-{SEQUENCE_3_DIGIT}`
Contoh: `PJD-20260609-001`

**Form Fields:**
```typescript
interface PengajuanDana {
  id: string;
  nomorPengajuan: string;       // Auto-generate
  tanggalPengajuan: string;     // ISO 8601
  pemohon: string;              // User ID
  divisi: string;
  kategori: string;             // ID Kategori
  keperluan: string;            // Max 500 char
  nominalPengajuan: number;     // > 0
  lampiran: Lampiran[];         // File references (Drive)
  status: PengajuanStatus;
  catatanApproval?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

type PengajuanStatus =
  | 'draft'
  | 'pending_hm'
  | 'pending_direktur'
  | 'approved'
  | 'rejected'
  | 'revision_requested'
  | 'disbursed';
```

**Validasi:**
- Nominal > 0
- Keperluan minimal 10 karakter
- Lampiran opsional saat draft, wajib saat submit
- Cek limit: nominal > `LIMIT_HM` → otomatis eskalasi ke Direktur

---

### Modul 5 — Persetujuan (Approval)

**Approval Actions:**
```typescript
type ApprovalAction = 'approve' | 'reject' | 'request_revision';

interface ApprovalPayload {
  referensiId: string;
  jenisDocument: 'pengajuan' | 'pengeluaran' | 'settlement' | 'replenishment';
  action: ApprovalAction;
  catatan?: string;             // Wajib jika reject/revision
  approvedBy: string;           // User ID approver
  approvedAt: string;           // ISO 8601
}
```

**Notifikasi Otomatis setelah Approval:**
- Approved → Gmail + in-app ke pemohon
- Rejected → Gmail + in-app ke pemohon dengan catatan alasan
- Revision → Gmail + in-app dengan link ke dokumen

---

### Modul 6 — Pengeluaran Kas Kecil

**Auto-Generate Nomor:** `TRX-{YYYYMMDD}-{SEQUENCE}`
Contoh: `TRX-20260609-001`

```typescript
interface Pengeluaran {
  id: string;
  nomorTransaksi: string;
  tanggalTransaksi: string;
  kategori: string;
  deskripsi: string;            // Max 500 char
  vendor?: string;
  nominal: number;
  buktiTransaksi: Lampiran[];   // Min 1 file, wajib
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
}
```

**Validasi Sistem:**
- `nominal > 0`
- `saldo_saat_ini >= nominal` (cek real-time sebelum submit)
- `buktiTransaksi.length >= 1` (minimal 1 file)
- Format file: JPG, PNG, PDF (max 5MB per file)

---

### Modul 7 — Pertanggungjawaban (Settlement)

**Auto-Generate Nomor:** `STL-{YYYYMMDD}-{SEQUENCE}`

```typescript
interface Settlement {
  id: string;
  nomorSettlement: string;
  referensiPengajuan: string;   // ID Pengajuan Dana
  danaDiterima: number;         // Dari pengajuan
  detailPengeluaran: DetailSettlement[];
  totalPengeluaran: number;     // Sum detail
  selisih: number;              // danaDiterima - totalPengeluaran
  catatan?: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
}

interface DetailSettlement {
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  bukti: Lampiran[];
}
```

**Business Rule:**
- `selisih > 0` → Sisa dana dikembalikan ke kas (dicatat sebagai incoming)
- `selisih < 0` → Flag warning, butuh catatan penjelasan
- `selisih = 0` → Settlement sempurna

---

### Modul 8 — Replenishment

**Auto-Generate Nomor:** `RPL-{YYYYMMDD}-{SEQUENCE}`

**Trigger Otomatis:**
- Sistem cek saldo setiap hari (GAS Time-trigger)
- Jika saldo < `SALDO_MINIMUM`, kirim notifikasi ke Admin Finance untuk mengajukan replenishment

```typescript
interface Replenishment {
  id: string;
  nomorReplenishment: string;
  tanggalPengajuan: string;
  saldoSaatIni: number;
  nominalPengisian: number;
  alasan: string;
  status: 'pending_hm' | 'pending_direktur' | 'approved' | 'rejected' | 'completed';
  approvalHM?: ApprovalRecord;
  approvalDirektur?: ApprovalRecord;
}
```

---

### Modul 9 — Laporan

#### Jenis Laporan & Filter

| Laporan | Filter Tersedia | Output |
|---|---|---|
| Laporan Transaksi | Periode, Kategori, Divisi, Status | PDF, Excel |
| Laporan Pengeluaran | Bulan, Tahun, Kategori | PDF, Excel |
| Laporan Settlement | Periode, Status | PDF, Excel |
| Laporan Replenishment | Periode | PDF, Excel |
| Laporan Saldo | Periode | PDF, Excel |

#### PDF Export Specification
- Header: Logo JEF GROUP, nama laporan, periode, tanggal cetak
- Footer: Halaman, tanda tangan digital approver
- Font: Inter + tabel presisi
- Generator: `@react-pdf/renderer`

#### Excel Export Specification
- Sheet 1: Summary/Ringkasan
- Sheet 2: Detail Data
- Sheet 3: Grafik (chart embedded)
- Generator: `xlsx` (SheetJS)

---

### Modul 10 — Audit Trail

```typescript
interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  modul: AuditModule;
  aktivitas: AuditActivity;
  keterangan: string;           // Detail perubahan (JSON diff)
  ipAddress?: string;
  userAgent?: string;
  waktu: string;                // ISO 8601
}

type AuditModule =
  | 'auth' | 'pengajuan' | 'pengeluaran' | 'settlement'
  | 'replenishment' | 'master_pengguna' | 'master_kategori'
  | 'laporan' | 'pengaturan';

type AuditActivity =
  | 'login' | 'logout'
  | 'create' | 'update' | 'delete'
  | 'approve' | 'reject' | 'revision_request'
  | 'upload_dokumen' | 'export_laporan'
  | 'view_sensitif';
```

**Retention:** Log disimpan minimal 2 tahun.
**Filter Audit Trail:** By user, modul, aktivitas, periode.

---

### Modul 11 — Notifikasi

#### Trigger & Penerima

| Event | Penerima | Channel |
|---|---|---|
| Pengajuan baru | Head Manager divisi | Gmail + In-app |
| Pengajuan eskalasi ke Direktur | Direktur | Gmail + In-app |
| Pengajuan disetujui | Admin Finance pengaju | Gmail + In-app |
| Pengajuan ditolak | Admin Finance pengaju | Gmail + In-app |
| Settlement pending | Head Manager | In-app |
| Replenishment pending HM | Head Manager | Gmail + In-app |
| Replenishment pending Direktur | Direktur | Gmail + In-app |
| Saldo < minimum | Admin Finance | Gmail + In-app |
| Approval aging > 1 hari | Head Manager + Direktur | Gmail |

#### In-App Notification Center
- Bell icon di topbar dengan badge counter
- Dropdown: 20 notifikasi terbaru
- Mark as read / Mark all as read
- Redirect ke dokumen terkait saat diklik
- Real-time update via polling setiap 30 detik

---

## 11. STRUKTUR DATABASE (GOOGLE SHEETS)

### Sheet: `Pengguna`
| Kolom | Tipe | Format | Keterangan |
|---|---|---|---|
| ID_Pengguna | String | USR-001 | Primary Key |
| Nama | String | — | Nama lengkap |
| Email | String | email | Google Workspace |
| Jabatan | String | — | Jabatan struktural |
| Peran | Enum | direktur/head_manager/admin_finance | Role RBAC |
| Divisi | String | — | Nama divisi |
| Status | Enum | active/inactive | — |
| Tanggal_Dibuat | DateTime | ISO 8601 | — |
| Terakhir_Login | DateTime | ISO 8601 | — |

### Sheet: `Kategori_Pengeluaran`
| Kolom | Tipe | Format |
|---|---|---|
| ID_Kategori | String | KAT-001 |
| Nama_Kategori | String | — |
| Keterangan | String | — |
| Status | Enum | active/inactive |

### Sheet: `Pengajuan_Dana`
| Kolom | Tipe | Format |
|---|---|---|
| ID_Pengajuan | String | UUID |
| Nomor_Pengajuan | String | PJD-YYYYMMDD-001 |
| Tanggal_Pengajuan | DateTime | ISO 8601 |
| ID_Pemohon | String | USR-001 |
| Divisi | String | — |
| ID_Kategori | String | KAT-001 |
| Keperluan | String | Max 500 char |
| Nominal_Pengajuan | Number | Desimal 2 |
| Status | Enum | draft/pending_hm/... |
| Catatan_Approval | String | — |
| Tanggal_Dibuat | DateTime | — |
| Tanggal_Diupdate | DateTime | — |

### Sheet: `Persetujuan`
| Kolom | Tipe |
|---|---|
| ID_Persetujuan | String (UUID) |
| Referensi_ID | String |
| Jenis_Dokumen | Enum |
| ID_Penyetuju | String |
| Nama_Penyetuju | String |
| Jabatan_Penyetuju | String |
| Aksi | Enum (approve/reject/revision) |
| Status_Sebelum | Enum |
| Status_Sesudah | Enum |
| Catatan | String |
| Tanggal_Persetujuan | DateTime |

### Sheet: `Pengeluaran_Kas_Kecil`
| Kolom | Tipe |
|---|---|
| ID_Pengeluaran | String (UUID) |
| Nomor_Transaksi | String (TRX-...) |
| Tanggal_Transaksi | DateTime |
| ID_Kategori | String |
| Deskripsi | String |
| Vendor | String (nullable) |
| Nominal | Number |
| Status | Enum |
| ID_Pembuat | String |
| Tanggal_Dibuat | DateTime |

### Sheet: `Pertanggungjawaban`
| Kolom | Tipe |
|---|---|
| ID_PJ | String (UUID) |
| Nomor_Settlement | String (STL-...) |
| ID_Pengajuan | String |
| Dana_Diterima | Number |
| Total_Pengeluaran | Number |
| Selisih | Number |
| Catatan | String |
| Status | Enum |
| Tanggal_Dibuat | DateTime |

### Sheet: `Detail_Pertanggungjawaban`
| Kolom | Tipe |
|---|---|
| ID_Detail | String (UUID) |
| ID_PJ | String (FK) |
| Tanggal | Date |
| ID_Kategori | String |
| Deskripsi | String |
| Nominal | Number |

### Sheet: `Replenishment`
| Kolom | Tipe |
|---|---|
| ID_Replenishment | String (UUID) |
| Nomor_Replenishment | String (RPL-...) |
| Tanggal_Pengajuan | DateTime |
| Saldo_Saat_Ini | Number |
| Nominal_Pengisian | Number |
| Alasan | String |
| Status | Enum |
| Tanggal_Dibuat | DateTime |

### Sheet: `Saldo_Kas_Kecil`
| Kolom | Tipe | Keterangan |
|---|---|---|
| ID_Saldo | String | UUID |
| Tanggal | Date | Tanggal record |
| Saldo_Awal | Number | Saldo awal hari |
| Total_Pengeluaran | Number | Sum pengeluaran hari ini |
| Total_Pengisian | Number | Replenishment masuk hari ini |
| Saldo_Akhir | Number | Kalkulasi: awal - keluar + masuk |

### Sheet: `Lampiran_Dokumen`
| Kolom | Tipe |
|---|---|
| ID_Dokumen | String (UUID) |
| Referensi_ID | String |
| Jenis_Referensi | Enum |
| Nama_File | String |
| Link_Google_Drive | URL |
| MIME_Type | String |
| Ukuran_File | Number (bytes) |
| Upload_Oleh | String (User ID) |
| Tanggal_Upload | DateTime |

### Sheet: `Notifikasi`
| Kolom | Tipe |
|---|---|
| ID_Notifikasi | String (UUID) |
| ID_Penerima | String |
| Judul | String |
| Pesan | String |
| Referensi_ID | String |
| Jenis_Referensi | Enum |
| Status_Baca | Boolean |
| Tanggal_Kirim | DateTime |
| Tanggal_Dibaca | DateTime (nullable) |

### Sheet: `Log_Aktivitas`
| Kolom | Tipe |
|---|---|
| ID_Log | String (UUID) |
| ID_Pengguna | String |
| Nama_Pengguna | String |
| Modul | Enum |
| Aktivitas | Enum |
| Keterangan | JSON String |
| IP_Address | String |
| Waktu | DateTime |

### Sheet: `Pengaturan_Sistem`
| Nama_Pengaturan | Nilai Default | Tipe |
|---|---|---|
| SALDO_MINIMUM | 500000 | Number |
| LIMIT_PERSETUJUAN_HM | 2000000 | Number |
| LIMIT_PERSETUJUAN_DIREKTUR | — | Number |
| NAMA_PERUSAHAAN | JEF GROUP ID | String |
| EMAIL_NOTIFIKASI_DEFAULT | — | String |
| POLLING_INTERVAL_MS | 30000 | Number |
| MAX_FILE_SIZE_MB | 5 | Number |
| ALLOWED_FILE_TYPES | jpg,png,pdf | String |

---

## 12. API & BACKEND SPECIFICATION (GAS)

### 12.1 Endpoint Pattern

**Base URL:** `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec`

**GET Requests:**
```
GET ?action={actionName}&param1=value1&param2=value2
```

**POST Requests:**
```json
POST {
  "action": "actionName",
  "data": { ... }
}
```

### 12.2 Action List

#### Auth
| Action | Method | Deskripsi |
|---|---|---|
| `validateUser` | GET | Validasi email + return role |
| `getUserProfile` | GET | Ambil profil pengguna |

#### Dashboard
| Action | Method | Deskripsi |
|---|---|---|
| `getDashboardStats` | GET | Widget stats sesuai role |
| `getChartData` | GET | Data untuk grafik |

#### Pengajuan
| Action | Method | Deskripsi |
|---|---|---|
| `getPengajuanList` | GET | List dengan filter |
| `getPengajuanDetail` | GET | Detail 1 record |
| `createPengajuan` | POST | Buat pengajuan baru |
| `updatePengajuan` | POST | Update draft |
| `submitPengajuan` | POST | Submit untuk approval |
| `approvePengajuan` | POST | Approve/reject/revision |

#### Pengeluaran
| Action | Method | Deskripsi |
|---|---|---|
| `getPengeluaranList` | GET | List dengan filter |
| `createPengeluaran` | POST | Input pengeluaran baru |
| `approvePengeluaran` | POST | Approve/reject |

#### Settlement
| Action | Method | Deskripsi |
|---|---|---|
| `getSettlementList` | GET | List |
| `createSettlement` | POST | Buat settlement |
| `approveSettlement` | POST | Approve/reject |

#### Replenishment
| Action | Method | Deskripsi |
|---|---|---|
| `getReplenishmentList` | GET | List |
| `createReplenishment` | POST | Buat replenishment |
| `approveReplenishment` | POST | Approve/reject per level |

#### Laporan
| Action | Method | Deskripsi |
|---|---|---|
| `getLaporanTransaksi` | GET | Data laporan transaksi |
| `getLaporanPengeluaran` | GET | Data laporan pengeluaran |
| `getLaporanSettlement` | GET | Data laporan settlement |

#### Master Data
| Action | Method | Deskripsi |
|---|---|---|
| `getPenggunаList` | GET | List pengguna |
| `createPengguna` | POST | Buat pengguna |
| `updatePengguna` | POST | Update pengguna |
| `getKategoriList` | GET | List kategori |

#### File
| Action | Method | Deskripsi |
|---|---|---|
| `uploadFile` | POST | Upload ke Google Drive |
| `deleteFile` | POST | Delete dari Drive |

#### Notifikasi & Audit
| Action | Method | Deskripsi |
|---|---|---|
| `getNotifikasi` | GET | List notifikasi user |
| `markNotifikasiRead` | POST | Mark as read |
| `getAuditTrail` | GET | Log aktivitas |

### 12.3 Response Format

**Sukses:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Berhasil",
  "timestamp": "2026-06-09T10:00:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Saldo tidak mencukupi untuk transaksi ini"
  },
  "timestamp": "2026-06-09T10:00:00.000Z"
}
```

**Error Codes:**
| Code | HTTP Analog | Deskripsi |
|---|---|---|
| `UNAUTHORIZED` | 401 | Tidak ada akses |
| `FORBIDDEN` | 403 | Role tidak sesuai |
| `NOT_FOUND` | 404 | Data tidak ditemukan |
| `VALIDATION_ERROR` | 422 | Input tidak valid |
| `INSUFFICIENT_BALANCE` | 400 | Saldo tidak cukup |
| `INTERNAL_ERROR` | 500 | Error GAS internal |

---

## 13. NON-FUNCTIONAL REQUIREMENTS

### 13.1 Performance
| Metric | Target |
|---|---|
| Dashboard initial load | ≤ 3 detik |
| API response time (GAS) | ≤ 2 detik |
| Data table render (1000 rows) | ≤ 1 detik |
| File upload (5MB) | ≤ 10 detik |
| Concurrent users supported | ≥ 50 |
| Lighthouse Performance Score | ≥ 85 |

### 13.2 Reliability
| Metric | Target |
|---|---|
| Uptime target | 99.5% |
| GAS daily execution limit | < 6 jam/hari (GAS free limit: 6 jam) |
| GAS URL Fetch limit | < 20,000 panggilan/hari |

### 13.3 Scalability
- Sheet Google Spreadsheet: maks ~10 juta cells; estimasi JEF GROUP: ~500K cells/tahun → aman 20 tahun
- Jika melebihi: strategi arsip sheet per tahun (auto-archive via GAS trigger)

### 13.4 Browser Support
| Browser | Versi Minimum |
|---|---|
| Google Chrome | 100+ |
| Microsoft Edge | 100+ |
| Safari | 15+ |
| Firefox | 100+ |
| Mobile Chrome (Android) | Latest |
| Mobile Safari (iOS) | 15+ |

### 13.5 Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation penuh
- Screen reader compatible (ARIA labels)
- Color contrast ratio ≥ 4.5:1

---

## 14. RELASI DATA

```
Pengguna (1)
  ├── (N) Pengajuan_Dana
  │     ├── (N) Persetujuan
  │     └── (1) Pertanggungjawaban
  │           └── (N) Detail_Pertanggungjawaban
  ├── (N) Pengeluaran_Kas_Kecil
  └── (N) Replenishment

Pengajuan_Dana → Persetujuan (referensi_id + jenis_dokumen)
Pengajuan_Dana → Pertanggungjawaban (referensi_pengajuan)
Pengeluaran_Kas_Kecil → Persetujuan

Semua Dokumen → Lampiran_Dokumen (referensi_id + jenis_referensi)
Semua Aktivitas → Log_Aktivitas
Semua Event → Notifikasi
```

---

## 15. SECURITY & COMPLIANCE

### 15.1 Authentication
- Google OAuth 2.0 — single sign-on via Google Workspace
- NextAuth.js session (JWT, httpOnly cookie, 8 jam)
- Server-side role validation pada setiap GAS request

### 15.2 Authorization
- RBAC enforced di frontend (UI hiding) DAN backend (GAS validation)
- Setiap GAS action memvalidasi role sebelum eksekusi
- Prinsip least privilege: user hanya bisa akses data divisi sendiri (kecuali Direktur)

### 15.3 Data Protection
- Semua komunikasi via HTTPS
- Google Drive file: visibility "Private, shared with specific accounts"
- Spreadsheet: tidak di-share publik, akses via GAS service account
- Tidak menyimpan password pengguna (delegasi ke Google)

### 15.4 Input Validation
- Frontend: Zod schema validation
- Backend (GAS): re-validate setiap input sebelum write ke sheet
- File upload: validate MIME type + ukuran di GAS sebelum simpan ke Drive

### 15.5 Audit & Compliance
- Setiap write operation dicatat di `Log_Aktivitas`
- Log tidak bisa dihapus oleh role manapun (append-only)
- Data keuangan tidak bisa dihapus, hanya bisa void/cancelled

---

## 16. NOTIFICATION SYSTEM

### 16.1 Gmail Notification Template

**Subject Format:** `[Juara PettyCash] {Judul Event} — {Nomor Dokumen}`

**Body Format:**
```
Header: Logo JEF GROUP + Nama Sistem
Body: Detail event + link ke dokumen
Action Button: "Buka Dokumen" → deep link ke aplikasi
Footer: Copyright JEF GROUP ID
```

### 16.2 In-App Notification
- Polling: setiap 30 detik (configurable via `POLLING_INTERVAL_MS`)
- Max tampil: 20 notifikasi terbaru di dropdown
- Badge: count unread (hidden jika 0)
- Auto-expire: notifikasi > 30 hari di-archive

---

## 17. DEPLOYMENT & DEVOPS

### 17.1 Frontend Deployment (Vercel)

```bash
# Environment Variables
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<random-secret>
GOOGLE_CLIENT_ID=<oauth-client-id>
GOOGLE_CLIENT_SECRET=<oauth-client-secret>
NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/{ID}/exec
```

### 17.2 GAS Deployment (clasp)

```bash
# Install clasp
npm install -g @google/clasp

# Login
clasp login

# Push & Deploy
clasp push
clasp deploy --description "V1.0 Production"
```

**GAS Triggers (Time-based):**
| Trigger | Jadwal | Fungsi |
|---|---|---|
| Cek saldo minimum | Setiap hari 08:00 | `checkMinimumBalance()` |
| Approval aging alert | Setiap hari 14:00 | `checkApprovalAging()` |
| Backup spreadsheet | Setiap hari 00:00 | `backupSpreadsheet()` |

### 17.3 Backup Strategy
- Google Sheets: copy otomatis harian ke folder Drive `/JEF_PettyCash_Backup/YYYY-MM-DD/`
- Retention: 90 hari
- Manual backup: Direktur bisa trigger manual dari halaman Pengaturan

---

## 18. RISIKO & MITIGASI

| # | Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|---|
| 1 | GAS daily execution limit tercapai (6 jam/hari) | Medium | High | Optimasi query, batching, caching di frontend |
| 2 | Google Sheets lambat saat data > 100K rows | Medium | Medium | Strategi arsip sheet per tahun |
| 3 | GAS Web App down / maintenance Google | Low | High | Error handling + pesan informatif ke user |
| 4 | Upload file gagal ke Drive | Medium | Medium | Retry logic + fallback error handling |
| 5 | User bypass RBAC via direct GAS URL | Low | High | Validasi role di setiap GAS handler |
| 6 | Session hijacking | Low | High | httpOnly cookie + HTTPS only |
| 7 | Data corruption di Spreadsheet | Low | High | Backup harian + audit trail |
| 8 | Compliance keuangan tidak terpenuhi | Medium | High | Konsultasi legal sebelum go-live; audit trail lengkap |

> ⚠️ **Risiko Operasional:** GAS memiliki quota limits (URL Fetch, execution time, email). Monitor usage secara berkala via GAS Execution Log.
> ⚠️ **Risiko Hukum:** Pastikan kebijakan penyimpanan dokumen keuangan digital sesuai regulasi perpajakan Indonesia (UU No. 28 Tahun 2007 & PMK terkait).

---

## 19. ROADMAP

### V1.0 — MVP (Target: Q3 2026)
- ✅ Auth & RBAC
- ✅ Dashboard (semua role)
- ✅ Pengajuan Dana (full workflow)
- ✅ Pengeluaran Kas Kecil
- ✅ Settlement
- ✅ Replenishment
- ✅ Laporan (PDF + Excel)
- ✅ Audit Trail
- ✅ Notifikasi (Gmail + In-app)
- ✅ Master Data (Pengguna + Kategori)

### V2.1 (Target: Q4 2026)
- ⬜ Multi-bahasa (Indonesia + English)
- ⬜ Mobile PWA (installable)
- ⬜ Bulk approval untuk Direktur
- ⬜ Advanced analytics & forecasting

### V3.0 (Target: Q1 2027)
- ⬜ Integrasi sistem akuntansi (Accurate / Jurnal)
- ⬜ OCR otomatis untuk bukti transaksi
- ⬜ Approval via WhatsApp (Twilio/WABA)
- ⬜ Multi-company support

---

*Dokumen ini adalah properti JEF GROUP ID. Dilarang mendistribusikan tanpa izin.*
*Versi: V1.0 | Juni 2026*
