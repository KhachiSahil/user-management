import { UploadCloud, X, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RowError { row: number; field: string; message: string }

export default function BulkUploadPage() {
  const nav = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<RowError[]>([]);
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      setUploading(true);
      await axios.post('http://localhost:4000/api/users/bulk-upload', fd);
      alert('Upload successful');
      nav('/users');
    } catch (err: any) {
      if (err.response?.status === 400) setErrors(err.response.data.errors || []);
      else alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    const res = await axios.get('http://localhost:4000/api/users/sample', { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'user-template.xlsx' });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto w-full max-w-xl p-6">
      <button onClick={() => nav(-1)} className="mb-6 inline-flex items-center gap-1 text-slate-600 hover:text-black">
        <X size={18} /> Back
      </button>

      <div className="rounded-xl bg-white shadow p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-indigo-600">Bulk Upload Users</h2>

        {/* Drop zone */}
        <label
          htmlFor="bulk-file"
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg py-10 px-4 text-center cursor-pointer hover:bg-slate-50 transition"
        >
          <UploadCloud size={46} className="text-indigo-500 shrink-0" />
          <span className="text-sm text-slate-600">
            {file ? file.name : 'Click or drag a .xlsx file here'}
          </span>
          <input
            id="bulk-file"
            type="file"
            accept=".xlsx"
            hidden
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setErrors([]);
            }}
          />
        </label>

        {/* Error panel */}
        {errors.length > 0 && (
          <div className="max-h-40 overflow-y-auto rounded-md border border-red-300 bg-red-50/60 p-3 text-sm text-red-700">
            <p className="font-medium mb-1">Validation Errors:</p>
            {errors.map((er, i) => (
              <p key={i}>
                Row {er.row}: {er.field} – {er.message}
              </p>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={upload}
            disabled={!file || uploading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {uploading && <Loader2 className="animate-spin" size={18} />}
            {uploading ? 'Uploading…' : 'Upload'}
          </button>

          <a
            href="http://localhost:4000/api/users/sample-pdf"
            className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-300 bg-white py-2 px-4 text-slate-700 hover:bg-slate-100"
            download
          >
            <Download size={16} /> Template
          </a>
        </div>
      </div>
    </section>
  );
}
