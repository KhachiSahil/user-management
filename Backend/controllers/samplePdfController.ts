import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';

/** GET /api/users/sample-pdf  → streams a one‑page PDF template */
export function downloadSamplePdf(_req: Request, res: Response) {
  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=user-template.pdf');
  doc.pipe(res);

  doc.fontSize(18).fillColor('#4f46e5').text('User Import Template', { align: 'center' });
  doc.moveDown();

  const headers = ['First Name', 'Last Name', 'Email', 'Phone Number', 'PAN Number'];
  const startX  = 40;
  const startY  = 120;
  const colW    = 110;

  // header row
  headers.forEach((h, i) => {
    doc.rect(startX + i * colW, startY, colW, 24).stroke();
    doc.fontSize(10).fillColor('black').text(h, startX + i * colW + 4, startY + 8);
  });

  // sample row
  const sample = ['Sahil', 'Khachi', 'sahil@email.com', '9876543210', 'ABCDE1234F'];
  sample.forEach((v, i) => {
    doc.rect(startX + i * colW, startY + 24, colW, 24).stroke();
    doc.text(v, startX + i * colW + 4, startY + 32);
  });

  doc.end();
}
