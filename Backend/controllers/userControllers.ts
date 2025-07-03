import { Request, Response } from 'express';
import { pool } from '../models/db';

export async function getUsers(req: Request, res: Response) {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function createUser(req: Request, res: Response) {
  const { firstName, lastName, email, phone, pan } = req.body;
  if (!firstName || !lastName || !email || !phone || !pan)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const {
      rows: [user],
    } = await pool.query(
      `INSERT INTO users (firstName, lastName, email, phone, pan)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [firstName, lastName, email, phone, pan]
    );
    res.status(201).json(user);
  } catch (e: any) {
    if (e.code === '23505') return res.status(409).json({ message: 'Email exists' }); // unique_violation
    res.status(500).json({ message: 'Failed to create user' });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const { firstname, lastname, email, phone, pan } = req.body;
  console.log(req.body)
  try {
    const { rowCount } = await pool.query(
      `UPDATE users
       SET firstName=$1, lastName=$2, email=$3, phone=$4, pan=$5
       WHERE id=$6`,
      [firstname, lastname, email, phone, pan, id]
    );
    if (!rowCount) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated' });
  } catch (e: any) {
    if (e.code === '23505') return res.status(409).json({ message: 'Email exists' });
    res.status(500).json({ message: 'Failed to update user' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  const { rowCount } = await pool.query('DELETE FROM users WHERE id=$1', [id]);
  if (!rowCount) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
}
