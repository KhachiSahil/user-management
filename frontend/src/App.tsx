import { useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Menu, X } from 'lucide-react';            // npm i lucide-react
import UserList from './components/UserListView';
import BulkUploadPage from './components/BulkUpload';
import UserForm from './components/UserForm';

const links = [
  { to: '/',      label: 'Home',   end: true },
  { to: '/users', label: 'Users' },
  { to: '/bulk',  label: 'Bulk Upload' },
  { to: '/add',   label: 'Add User' },
];

export default function App() {
  const [open, setOpen] = useState(false);        // mobile drawer

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* top bar */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-indigo-600">
            User&nbsp;Manager
          </h1>

          {/* desktop nav */}
          <nav className="hidden md:flex gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }: { isActive: boolean }) =>
                  `rounded px-3 py-1 text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* mobile burger */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen((p) => !p)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* mobile drawer */}
        {open && (
          <nav className="md:hidden bg-white border-t shadow-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }: { isActive: boolean }) =>
                  `block px-4 py-2 text-sm ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {/* main content */}
      <main className="flex-1 mx-auto w-full max-w-6xl p-4 md:p-0">
        <div className="bg-white shadow rounded-lg p-4 md:p-0">
          <Routes>
            <Route path="/"      element={<p className="text-xl h-20 pt-5 pl-5 mt-10">Welcome 👋</p>} />
            <Route path="/users" element={<UserList />} />
            <Route path="/bulk"  element={<BulkUploadPage />} />
            <Route path="/add"   element={<UserForm />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
