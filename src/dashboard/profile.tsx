
import { useEffect, useState } from 'react';
import { getUserProfile, type UserProfile } from '../apiservice/Apiservice';

// Dummy update function (replace with real API call when available)
async function updateSupplierProfile(supplier: Partial<UserProfile['supplier']>): Promise<void> {
	// TODO: Replace with actual API call
	return new Promise((resolve) => setTimeout(resolve, 1000));
}


export default function ProfilePage() {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState<Partial<UserProfile['supplier']>>({});
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	useEffect(() => {
		getUserProfile()
			.then((data) => {
				setProfile(data);
				setForm(data.supplier);
			})
			.catch(() => setError('Failed to load profile'))
			.finally(() => setLoading(false));
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleEdit = () => {
		setEditMode(true);
		setSaveError(null);
	};

	const handleCancel = () => {
		if (profile) setForm(profile.supplier);
		setEditMode(false);
		setSaveError(null);
	};

	const handleSave = async () => {
		setSaving(true);
		setSaveError(null);
		try {
			await updateSupplierProfile(form);
			setProfile((prev) => prev ? { ...prev, supplier: { ...prev.supplier, ...form } } : prev);
			setEditMode(false);
		} catch (err) {
			setSaveError('Failed to save changes');
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <div className="p-8">Loading profile...</div>;
	if (error) return <div className="p-8 text-red-600">{error}</div>;
	if (!profile) return <div className="p-8">No profile data found.</div>;

	return (
		<div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-6">Supplier Profile</h1>
			<div className="mb-4">
				<div className="font-semibold">Email:</div>
				<div>{profile.email}</div>
			</div>
			<div className="mb-4">
				<div className="font-semibold">Role:</div>
				<div>{profile.role}</div>
			</div>
			<div className="mb-4">
				<div className="font-semibold">Status:</div>
				<div>{profile.status}</div>
			</div>
			<div className="mb-4">
				<div className="font-semibold">Email Verified:</div>
				<div>{profile.emailVerified ? 'Yes' : 'No'}</div>
			</div>
			<div className="mb-4">
				<div className="font-semibold">Created At:</div>
				<div>{new Date(profile.createdAt).toLocaleString()}</div>
			</div>
			<div className="mb-4">
				<div className="font-semibold">Updated At:</div>
				<div>{new Date(profile.updatedAt).toLocaleString()}</div>
			</div>
			<h2 className="text-xl font-semibold mt-8 mb-4">Company Details</h2>
			<form onSubmit={e => { e.preventDefault(); handleSave(); }}>
				<div className="mb-2">
					<div className="font-semibold">Company Name:</div>
					{editMode ? (
						<input
							type="text"
							name="companyName"
							value={form.companyName || ''}
							onChange={handleChange}
							className="border rounded px-2 py-1 w-full"
							required
						/>
					) : (
						<div>{profile.supplier.companyName}</div>
					)}
				</div>
				<div className="mb-2">
					<div className="font-semibold">TPIN:</div>
					{editMode ? (
						<input
							type="text"
							name="tpin"
							value={form.tpin || ''}
							onChange={handleChange}
							className="border rounded px-2 py-1 w-full"
							required
						/>
					) : (
						<div>{profile.supplier.tpin}</div>
					)}
				</div>
				<div className="mb-2">
					<div className="font-semibold">Registration Number:</div>
					{editMode ? (
						<input
							type="text"
							name="registrationNumber"
							value={form.registrationNumber || ''}
							onChange={handleChange}
							className="border rounded px-2 py-1 w-full"
							required
						/>
					) : (
						<div>{profile.supplier.registrationNumber}</div>
					)}
				</div>
				<div className="mb-2">
					<div className="font-semibold">Contact Person:</div>
					{editMode ? (
						<input
							type="text"
							name="contactPerson"
							value={form.contactPerson || ''}
							onChange={handleChange}
							className="border rounded px-2 py-1 w-full"
							required
						/>
					) : (
						<div>{profile.supplier.contactPerson}</div>
					)}
				</div>
				<div className="mb-2">
					<div className="font-semibold">Phone:</div>
					{editMode ? (
						<input
							type="text"
							name="phone"
							value={form.phone || ''}
							onChange={handleChange}
							className="border rounded px-2 py-1 w-full"
							required
						/>
					) : (
						<div>{profile.supplier.phone}</div>
					)}
				</div>
				<div className="mb-2">
					<div className="font-semibold">Supplier Email:</div>
					{editMode ? (
						<input
							type="email"
							name="email"
							value={form.email || ''}
							onChange={handleChange}
							className="border rounded px-2 py-1 w-full"
							required
						/>
					) : (
						<div>{profile.supplier.email}</div>
					)}
				</div>
				<div className="mb-2">
					<div className="font-semibold">Address:</div>
					{editMode ? (
						<input
							type="text"
							name="address"
							value={form.address || ''}
							onChange={handleChange}
							className="border rounded px-2 py-1 w-full"
						/>
					) : (
						<div>{profile.supplier.address || '-'}</div>
					)}
				</div>
				<div className="mb-2">
					<div className="font-semibold">Supplier Status:</div>
					<div>{profile.supplier.status}</div>
				</div>
				<div className="mb-2">
					<div className="font-semibold">Supplier Created At:</div>
					<div>{new Date(profile.supplier.createdAt).toLocaleString()}</div>
				</div>
				<div className="mb-2">
					<div className="font-semibold">Supplier Updated At:</div>
					<div>{new Date(profile.supplier.updatedAt).toLocaleString()}</div>
				</div>
				{editMode ? (
					<div className="flex gap-2 mt-4">
						<button
							type="submit"
							className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
							disabled={saving}
						>
							{saving ? 'Saving...' : 'Save'}
						</button>
						<button
							type="button"
							className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
							onClick={handleCancel}
							disabled={saving}
						>
							Cancel
						</button>
						{saveError && <span className="text-red-600 ml-2">{saveError}</span>}
					</div>
				) : (
					<div className="flex gap-2 mt-4">
						<button
							type="button"
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
							onClick={handleEdit}
						>
							Edit
						</button>
					</div>
				)}
			</form>
		</div>
	);
}
