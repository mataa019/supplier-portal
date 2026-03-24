import { useEffect, useState } from 'react';
import { getUserProfile, type UserProfile, } from '../apiservice/Apiservice';

export default function ProfilePage() {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getUserProfile()
			.then(setProfile)
			.catch(() => setError('Failed to load profile'))
			.finally(() => setLoading(false));
	}, []);

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
			<div className="mb-2">
				<div className="font-semibold">Company Name:</div>
				<div>{profile.supplier.companyName}</div>
			</div>
			<div className="mb-2">
				<div className="font-semibold">TPIN:</div>
				<div>{profile.supplier.tpin}</div>
			</div>
			<div className="mb-2">
				<div className="font-semibold">Registration Number:</div>
				<div>{profile.supplier.registrationNumber}</div>
			</div>
			<div className="mb-2">
				<div className="font-semibold">Contact Person:</div>
				<div>{profile.supplier.contactPerson}</div>
			</div>
			<div className="mb-2">
				<div className="font-semibold">Phone:</div>
				<div>{profile.supplier.phone}</div>
			</div>
			<div className="mb-2">
				<div className="font-semibold">Supplier Email:</div>
				<div>{profile.supplier.email}</div>
			</div>
			<div className="mb-2">
				<div className="font-semibold">Address:</div>
				<div>{profile.supplier.address || '-'}</div>
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
		</div>
	);
}
