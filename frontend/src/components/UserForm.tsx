import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emailRx = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRx = /^\d{10}$/;
const panRx = /^[A-Z]{5}\d{4}[A-Z]$/;

export default function UserForm() {
    const nav = useNavigate();

    const [firstName, setFirst] = useState('');
    const [lastName, setLast] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pan, setPan] = useState('');
    const [showPan, setShow] = useState(false);

    const notify = (msg: string) => toast(msg, { position: 'bottom-right' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName.trim()) return notify('First name is required');
        if (!lastName.trim()) return notify('Last name is required');
        if (!emailRx.test(email)) return notify('Enter a valid email');
        if (!phoneRx.test(phone)) return notify('Phone must be 10 digits');
        if (!panRx.test(pan)) return notify('Enter a valid PAN');

        try {
            await axios.post('http://localhost:4000/api/users', {
                firstName, lastName, email, phone, pan
            });
            notify('User added');
            nav('/users');                       // go back to list
        } catch (err: any) {
            if (err.response?.status === 409) notify('Email already exists');
            else notify('Server error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <ToastContainer aria-label="Notification Messages" />

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white shadow-lg rounded-xl px-8 py-10">
                <h2 className="text-2xl font-bold text-center mb-4">Add User</h2>

                <Field id="first" label="First Name" value={firstName} onChange={setFirst} />
                <Field id="last" label="Last Name" value={lastName} onChange={setLast} />
                <Field id="em" label="Email" type="email" value={email} onChange={setEmail} />
                <Field id="ph" label="Phone" type="tel" value={phone} onChange={setPhone} />

                {/* PAN */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="pan" className="font-semibold">PAN No.</label>
                    <div className="relative">
                        <input
                            id="pan"
                            type={showPan ? 'text' : 'password'}
                            value={pan}
                            onChange={(e) => setPan(e.target.value.toUpperCase())}
                            placeholder="ABCDE1234F"
                            className="w-full rounded-md border px-3 py-2 pr-10 focus:border-indigo-500 focus:outline-none"
                        />
                        <button type="button" onClick={() => setShow(!showPan)} className="absolute top-2 right-3 text-gray-500 hover:text-indigo-600">
                            {showPan ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">
                    Submit
                </button>
            </form>
        </div>
    );
}

interface FieldProps {
    id: string; label: string; value: string;
    onChange: (v: string) => void; type?: string;
}
const Field = ({ id, label, value, onChange, type = 'text' }: FieldProps) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={id} className="font-semibold">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
    </div>
);
