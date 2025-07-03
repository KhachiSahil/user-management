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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const db_1 = require("../models/db");
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { rows } = yield db_1.pool.query('SELECT * FROM users ORDER BY id DESC');
            res.json(rows);
        }
        catch (_a) {
            res.status(500).json({ message: 'Server error' });
        }
    });
}
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, email, phone, pan } = req.body;
        if (!firstName || !lastName || !email || !phone || !pan)
            return res.status(400).json({ message: 'All fields are required' });
        try {
            const { rows: [user], } = yield db_1.pool.query(`INSERT INTO users (firstName, lastName, email, phone, pan)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`, [firstName, lastName, email, phone, pan]);
            res.status(201).json(user);
        }
        catch (e) {
            if (e.code === '23505')
                return res.status(409).json({ message: 'Email exists' }); // unique_violation
            res.status(500).json({ message: 'Failed to create user' });
        }
    });
}
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { firstname, lastname, email, phone, pan } = req.body;
        console.log(req.body);
        try {
            const { rowCount } = yield db_1.pool.query(`UPDATE users
       SET firstName=$1, lastName=$2, email=$3, phone=$4, pan=$5
       WHERE id=$6`, [firstname, lastname, email, phone, pan, id]);
            if (!rowCount)
                return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User updated' });
        }
        catch (e) {
            if (e.code === '23505')
                return res.status(409).json({ message: 'Email exists' });
            res.status(500).json({ message: 'Failed to update user' });
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { rowCount } = yield db_1.pool.query('DELETE FROM users WHERE id=$1', [id]);
        if (!rowCount)
            return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    });
}
