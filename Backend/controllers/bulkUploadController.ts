import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import { pool } from '../models/db';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^\d{10}$/;
const PAN_REGEX   = /^[A-Z]{5}\d{4}[A-Z]$/;

interface RowError {
  row: number;
  field: string;
  message: string;
}

const cellToString = (v: any): string =>
  typeof v === 'object'
    ? (v.text ?? String(v.hyperlink || '').replace(/^mailto:/, '')).trim()
    : String(v ?? '').trim();

export async function bulkUploadUsers(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(req.file.buffer);
  const sheet = wb.worksheets[0];

  const validRows: { firstName: string; lastName: string; email: string; phone: string; pan: string }[] = [];
  const errors: RowError[] = [];

  sheet.eachRow({ includeEmpty: false }, (row, idx) => {
    if (idx === 1) return;

    const cells   = Array.isArray(row.values) ? row.values.slice(1) : [];
    const first   = cellToString(cells[0]);
    const last    = cellToString(cells[1]);
    const email   = cellToString(cells[2]);
    const phone   = cellToString(cells[3]);
    const pan     = cellToString(cells[4]);

    if (!first)            errors.push({ row: idx, field: 'First Name', message: 'Required' });
    if (!last)             errors.push({ row: idx, field: 'Last Name',  message: 'Required' });
    if (!EMAIL_REGEX.test(email))  errors.push({ row: idx, field: 'Email', message: 'Invalid email' });
    if (!PHONE_REGEX.test(phone))  errors.push({ row: idx, field: 'Phone', message: '10 digits only' });
    if (!PAN_REGEX.test(pan))      errors.push({ row: idx, field: 'PAN',   message: 'Invalid PAN' });

    if (!errors.find(e => e.row === idx)) validRows.push({ firstName: first, lastName: last, email, phone, pan });
  });

  if (errors.length) return res.status(400).json({ message: 'Validation errors', errors });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const sql = 'INSERT INTO users (firstName, lastName, email, phone, pan) VALUES ($1,$2,$3,$4,$5)';
    for (const v of validRows) await client.query(sql, [v.firstName, v.lastName, v.email, v.phone, v.pan]);
    await client.query('COMMIT');
    res.json({ message: `${validRows.length} users imported.` });
  } catch (e: any) {
    await client.query('ROLLBACK');
    if (e.code === '23505')
      return res.status(409).json({ message: 'Duplicate email in one or more rows.' });
    res.status(500).json({ message: 'Bulk upload failed' });
  } finally {
    client.release();
  }
}
