// src/routes/userRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userControllers';
import { bulkUploadUsers } from '../controllers/bulkUploadController';
import { downloadSamplePdf } from '../controllers/samplePdfController';
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res, next) => {
  getUsers(req, res).catch(next);
});

router.post('/', (req, res, next) => {
  createUser(req, res).catch(next);
});

router.put('/:id', (req, res, next) => {
  console.log("fired")
  updateUser(req, res).catch(next);
});

router.delete('/:id', (req, res, next) => {
  deleteUser(req, res).catch(next);
});

router.post('/bulk-upload', upload.single('file'), (req, res, next) => {
  bulkUploadUsers(req, res).catch(next);
});

router.get('/sample-pdf', downloadSamplePdf);
export default router;
