"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUploadUsers = bulkUploadUsers;
const exceljs_1 = __importDefault(require("exceljs"));
const db_1 = require("../models/db");
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^\d{10}$/;
const PAN_REGEX = /^[A-Z]{5}\d{4}[A-Z]$/;
const cellToString = (v) => {
    var _a;
    return typeof v === 'object'
        ? ((_a = v.text) !== null && _a !== void 0 ? _a : String(v.hyperlink || '').replace(/^mailto:/, '')).trim()
        : String(v !== null && v !== void 0 ? v : '').trim();
};
function bulkUploadUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.file)
            return res.status(400).json({ message: 'No file uploaded' });
        const wb = new exceljs_1.default.Workbook();
        yield wb.xlsx.load(req.file.buffer);
        const sheet = wb.worksheets[0];
        const validRows = [];
        const errors = [];
        sheet.eachRow({ includeEmpty: false }, (row, idx) => {
            if (idx === 1)
                return;
            const cells = Array.isArray(row.values) ? row.values.slice(1) : [];
            const first = cellToString(cells[0]);
            const last = cellToString(cells[1]);
            const email = cellToString(cells[2]);
            const phone = cellToString(cells[3]);
            const pan = cellToString(cells[4]);
            if (!first)
                errors.push({ row: idx, field: 'First Name', message: 'Required' });
            if (!last)
                errors.push({ row: idx, field: 'Last Name', message: 'Required' });
            if (!EMAIL_REGEX.test(email))
                errors.push({ row: idx, field: 'Email', message: 'Invalid email' });
            if (!PHONE_REGEX.test(phone))
                errors.push({ row: idx, field: 'Phone', message: '10 digits only' });
            if (!PAN_REGEX.test(pan))
                errors.push({ row: idx, field: 'PAN', message: 'Invalid PAN' });
            if (!errors.find(e => e.row === idx))
                validRows.push({ firstName: first, lastName: last, email, phone, pan });
        });
        if (errors.length)
            return res.status(400).json({ message: 'Validation errors', errors });
        const client = yield db_1.pool.connect();
        try {
            yield client.query('BEGIN');
            const sql = 'INSERT INTO users (firstName, lastName, email, phone, pan) VALUES ($1,$2,$3,$4,$5)';
            for (const v of validRows)
                yield client.query(sql, [v.firstName, v.lastName, v.email, v.phone, v.pan]);
            yield client.query('COMMIT');
            res.json({ message: `${validRows.length} users imported.` });
        }
        catch (e) {
            yield client.query('ROLLBACK');
            if (e.code === '23505')
                return res.status(409).json({ message: 'Duplicate email in one or more rows.' });
            res.status(500).json({ message: 'Bulk upload failed' });
        }
        finally {
            client.release();
        }
    });
}
