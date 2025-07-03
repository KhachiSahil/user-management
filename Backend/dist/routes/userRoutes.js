"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const userControllers_1 = require("../controllers/userControllers");
const bulkUploadController_1 = require("../controllers/bulkUploadController");
const samplePdfController_1 = require("../controllers/samplePdfController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get('/', (req, res, next) => {
    (0, userControllers_1.getUsers)(req, res).catch(next);
});
router.post('/', (req, res, next) => {
    (0, userControllers_1.createUser)(req, res).catch(next);
});
router.put('/:id', (req, res, next) => {
    console.log("fired");
    (0, userControllers_1.updateUser)(req, res).catch(next);
});
router.delete('/:id', (req, res, next) => {
    (0, userControllers_1.deleteUser)(req, res).catch(next);
});
router.post('/bulk-upload', upload.single('file'), (req, res, next) => {
    (0, bulkUploadController_1.bulkUploadUsers)(req, res).catch(next);
});
router.get('/sample-pdf', samplePdfController_1.downloadSamplePdf);
exports.default = router;
