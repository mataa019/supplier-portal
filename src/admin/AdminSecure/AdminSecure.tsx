import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SuperAdminPage from './SuperAdminPage';

// Only allow access if path is /admin-super-minet
const AdminSecure = () => {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (location.pathname !== '/admin-super-minet') {
			navigate('/'); // Redirect to home if not correct path
		}
	}, [location, navigate]);

	// Optionally, add more auth checks here
	return <SuperAdminPage />;
};

export default AdminSecure;
