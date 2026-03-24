import { useEffect, useState } from 'react';
import { getUserProfile, type UserProfile } from '../apiservice/Apiservice';

async function updateSupplierProfile(supplier: Partial<UserProfile['supplier']>): Promise<void> {
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
			setProfile((prev) =>
				prev ? { ...prev, supplier: { ...prev.supplier, ...form } } : prev
			);
			setEditMode(false);
		} catch {
			setSaveError('Failed to save changes');
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3">
				<div className="w-6 h-6 rounded-full border-2 border-slate-700 border-t-indigo-500 animate-spin" />
				<span className="text-slate-500 text-sm">Loading profile...</span>
			</div>
		);

	if (error)
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<span className="text-red-400 text-sm">{error}</span>
			</div>
		);

	if (!profile)
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<span className="text-slate-500 text-sm">No profile data found.</span>
			</div>
		);

	const initials = (profile.supplier.companyName || profile.email || 'S')
		.split(' ')
		.map((w: string) => w[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();

	const editableFields = [
		{ name: 'companyName', label: 'Company Name', required: true },
		{ name: 'contactPerson', label: 'Contact Person', required: true },
		{ name: 'email', label: 'Supplier Email', type: 'email', required: true },
		{ name: 'phone', label: 'Phone', required: true },
		{ name: 'tpin', label: 'TPIN', required: true, mono: true },
		{ name: 'registrationNumber', label: 'Registration No.', required: true, mono: true },
		{ name: 'address', label: 'Address' },
	];

	return (
		<div className="min-h-screen bg-slate-950 text-slate-200">

			{/* HEADER */}
			<div className="border-b border-slate-800 bg-slate-900">
				<div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">

					<div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold shadow">
						{initials}
					</div>

					<div className="flex-1">
						<h1 className="text-xl font-semibold text-white">
							{profile.supplier.companyName}
						</h1>
						<p className="text-sm text-slate-400">{profile.email}</p>

						<div className="flex flex-wrap gap-2 mt-3">
							<span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
								{profile.supplier.status}
							</span>
							<span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-400 border border-slate-700">
								{profile.role}
							</span>
							<span
								className={`px-3 py-1 text-xs rounded-full border ${
									profile.emailVerified
										? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
										: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
								}`}
							>
								{profile.emailVerified ? 'Verified' : 'Unverified'}
							</span>
						</div>
					</div>

					<div className="text-sm text-slate-400">
						Joined:{' '}
						{new Date(profile.createdAt).toLocaleDateString()}
					</div>
				</div>
			</div>

			{/* CONTENT */}
			<div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

				{/* SUPPLIER CARD */}
				<div className="bg-slate-900 border border-slate-800 rounded-2xl">

					<div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
						<div>
							<p className="text-xs text-slate-500 uppercase">Supplier Details</p>
							<p className="text-sm text-slate-300">Business info</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						{editableFields.map(({ name, label, type, required, mono }) => (
							<div key={name} className="px-6 py-4 border-b border-slate-800">
								<p className="text-xs text-slate-500 mb-1">{label}</p>

								{editMode ? (
									<input
										type={type || 'text'}
										name={name}
										value={(form as any)[name] || ''}
										onChange={handleChange}
										required={required}
										className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
									/>
								) : (
									<p className={`text-sm ${mono ? 'font-mono text-slate-400' : ''}`}>
										{(profile.supplier as any)[name] || '—'}
									</p>
								)}
							</div>
						))}
					</div>

					{/* ACTIONS */}
					<div className="flex items-center gap-3 px-6 py-4 border-t border-slate-800">

						{editMode ? (
							<>
								<button
									onClick={handleSave}
									disabled={saving}
									className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50"
								>
									{saving ? 'Saving...' : 'Save'}
								</button>

								<button
									onClick={handleCancel}
									className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm"
								>
									Cancel
								</button>

								{saveError && (
									<span className="text-red-400 text-sm">{saveError}</span>
								)}
							</>
						) : (
							<button
								onClick={handleEdit}
								className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-xl text-sm"
							>
								Edit Profile
							</button>
						)}
					</div>
				</div>

				{/* ACCOUNT CARD */}
				<div className="bg-slate-900 border border-slate-800 rounded-2xl">
					<div className="px-6 py-4 border-b border-slate-800">
						<p className="text-xs text-slate-500 uppercase">Account Info</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
						{[
							{ label: 'Email', value: profile.email },
							{ label: 'Role', value: profile.role },
							{ label: 'Status', value: profile.status },
							{ label: 'Created', value: new Date(profile.createdAt).toLocaleString() },
						].map(({ label, value }) => (
							<div key={label} className="px-6 py-4 border-b border-slate-800">
								<p className="text-xs text-slate-500 mb-1">{label}</p>
								<p className="text-sm text-slate-300 break-all">{value}</p>
							</div>
						))}
					</div>
				</div>

			</div>
		</div>
	);
}