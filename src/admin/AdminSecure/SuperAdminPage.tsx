import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../../apiservice/adminServices';
import { Modal } from 'antd';

const SuperAdminPage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createAccount(formData);
      setShowModal(false);
      setFormData({ email: '', password: '', role: 'admin', status: 'active' });
      // Redirect to OTP verification page with email
      navigate('/auth/verify-otp', { state: { email: formData.email } });
    } catch (err: any) {
      alert(err.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Super Admin Panel</h1>
      <p className="mb-6 text-gray-600">Only accessible with the special route: <b>admin-super-minet</b></p>
      <button
        onClick={handleOpen}
        className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
      >
        Add New Admin
      </button>
      <Modal
        open={showModal}
        onCancel={handleClose}
        title="Add Admin"
        footer={null}
        width={400}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Admin'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SuperAdminPage;
