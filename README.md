# User Management App

A full‑stack demo that lets you **create, read, update, delete, bulk‑upload, and download users** via a simple React + TypeScript UI and an Express + PostgreSQL (Neon) API.

## ✨ Features

| Frontend (React + Tailwind) | Backend (Node + Express)  |
|-----------------------------|---------------------------|
| Responsive dashboard        | RESTful CRUD routes       |
| Inline edit & delete        | File upload (Excel)       |
| Bulk upload with Excel      | Row‑level validation      |
| PAN mask / toggle eye       | Sample Excel & PDF download |
| Toast notifications         | SQL transactions & error handling |

---

## 🏗 Tech Stack

| Layer      | Tech                                     |
|------------|------------------------------------------|
| Frontend   | React 18, TypeScript, Tailwind CSS       |
| Backend    | Express, TypeScript, pg (`pg` driver)    |
| Database   | PostgreSQL (Neon cloud)                  |
| ORM        | — (raw SQL via `pg` Pool)                |
| File parse | `exceljs`                                |
| PDF        | `pdfkit`                                 |
| Dev tools  | Vite, ts‑node‑dev, React Router Dom      |

---

## 🚀 Quick Start

```bash
# 1. clone
git clone https://github.com/yourname/user-management.git
cd user-management

# 2. install root deps
npm install

# 3. spin up backend
cd backend
cp .env.example .env           # set DATABASE_URL + PORT
npm install
npx ts-node-dev src/app.ts     # http://localhost:4000/api/health

# 4. spin up frontend
cd ../frontend
npm install
npm run dev                    # http://localhost:5173
