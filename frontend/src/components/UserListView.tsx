import axios from "axios";
import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  pan: string;
}

export default function UserListView() {
  const [users, setUsers] = useState<User[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<User>>({});
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  useEffect(() => {
    axios.get("http://localhost:4000/api/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const startEdit = (user: User) => {
    setEditId(user.id);
    setForm(user);
    setMenuOpen(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({});
  };

  const saveEdit = async () => {
    if (!editId) return;
    await axios.put(`http://localhost:4000/api/users/${editId}`, form);
    setUsers((prev) =>
      prev.map((u) => (u.id === editId ? { ...u, ...form } : u))
    );
    cancelEdit();
  };

  const deleteUser = async (id: number) => {
    await axios.delete(`http://localhost:4000/api/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleChange = (field: keyof User, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Users</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-md">
        <table className="min-w-full text-sm sm:text-base divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["First", "Last", "Email", "Phone", "PAN", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                {editId === u.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        value={form.firstname || ""}
                        onChange={(e) => handleChange("firstname", e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={form.lastname || ""}
                        onChange={(e) => handleChange("lastname", e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={form.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={form.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={form.pan || ""}
                        onChange={(e) => handleChange("pan", e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button onClick={saveEdit} className="btn-primary text-sm mr-2">Save</button>
                      <button onClick={cancelEdit} className="btn-secondary text-sm">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{u.firstname}</td>
                    <td className="px-4 py-2">{u.lastname}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.phone}</td>
                    <td className="px-4 py-2">{u.pan}</td>
                    <td className="px-4 py-2 relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                        className="text-gray-500 hover:text-indigo-600"
                      >
                        <EllipsisVertical size={18} />
                      </button>

                      {menuOpen === u.id && (
                        <div className="absolute right-0 z-10 mt-2 w-28 rounded-md bg-white shadow-lg ring-1 ring-black/10">
                          <button
                            onClick={() => startEdit(u)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
