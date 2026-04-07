import { useEffect, useState } from 'react';
import { getAllAccounts, createAccount, getAccountById } from '../apiservice/adminServices';
import type { AdminAccount } from '../apiservice/adminModels';

import { Modal } from 'antd';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  UserCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AdminAccount | null>(null);
  // View account details
  const handleViewAccount = async (id: string) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const account = await getAccountById(id);
      setSelectedAccount(account);
    } catch {
      setSelectedAccount(null);
    } finally {
      setDetailLoading(false);
    }
  };

type User = AdminAccount & {
  name?: string; // for compatibility with form, but not used from backend
  department?: string; // not in backend, so will be blank
  lastLogin?: string; // not in backend, so will be blank
};



const roleColors = {
  admin: 'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
};

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-red-100 text-red-700',
};

const rolePermissions = {
  admin: ['Full access to all features', 'Manage users', 'System settings'],
  manager: ['Manage suppliers', 'Review applications', 'Verify payments'],
  viewer: ['View dashboards', 'View suppliers', 'View applications'],
};

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer' as 'admin' | 'manager' | 'viewer',
    department: '',
    status: 'active' as 'active' | 'inactive',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Add if not present

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Load users from backend
  useEffect(() => {
    setLoading(true);
    const minDuration = 2300;
    const start = Date.now();
    getAllAccounts()
      .then((data) => {
        // Map backend data to UI User type
        setUsers(
          data.map((u) => ({
            ...u,
            name: u.email.split('@')[0], // fallback, since backend has no name
            department: '', // not available
            lastLogin: '', // not available
          }))
        );
      })
      .catch(() => setUsers([]))
      .finally(() => {
        const elapsed = Date.now() - start;
        const remaining = minDuration - elapsed;
        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }
      });
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'viewer',
      department: '',
      status: 'active',
      password: '',
    });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      role: user.role as 'admin' | 'manager' | 'viewer',
      department: user.department || '',
      status: user.status as 'active' | 'inactive',
      password: '',
    });
    setShowModal(true);
  };

  // Optionally, implement backend delete here
  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user?.role === 'admin' && users.filter((u) => u.role === 'admin').length === 1) {
      alert('Cannot delete the last admin user.');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // Optionally, implement backend status toggle here
  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  };

  // Add user via backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editingUser) {
      // Optionally implement backend update here
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                department: formData.department,
                status: formData.status,
              }
            : u
        )
      );
      setLoading(false);
      setShowModal(false);
    } else {
      try {
        const newAccount = await createAccount({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          status: formData.status,
        });
        setUsers([
          ...users,
          {
            ...newAccount,
            name: formData.name,
            department: formData.department,
            lastLogin: '',
          },
        ]);
        setShowModal(false);
      } catch (err: any) {
        alert(err.message || 'Failed to create user');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage admin users and permissions</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 justify-center"
        >
          <PlusIcon className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-purple-600">{users.filter((u) => u.role === 'admin').length}</p>
          <p className="text-sm text-gray-500">Admins</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-blue-600">{users.filter((u) => u.role === 'manager').length}</p>
          <p className="text-sm text-gray-500">Managers</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === 'active').length}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Department</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Last Login</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewAccount(user.id)}>
                        {/* Account Detail Modal */}
                        <Modal
                          open={detailModalOpen}
                          onCancel={() => { setDetailModalOpen(false); setSelectedAccount(null); }}
                          title="Account Details"
                          footer={null}
                          width={400}
                        >
                          {detailLoading ? (
                            <div className="flex justify-center items-center py-8">Loading...</div>
                          ) : selectedAccount ? (
                            <div className="space-y-2">
                              <div><span className="font-semibold">ID:</span> {selectedAccount.id}</div>
                              <div><span className="font-semibold">Email:</span> {selectedAccount.email}</div>
                              <div><span className="font-semibold">Role:</span> {selectedAccount.role}</div>
                              <div><span className="font-semibold">Status:</span> {selectedAccount.status}</div>
                              <div><span className="font-semibold">Email Verified:</span> {selectedAccount.emailVerified ? 'Yes' : 'No'}</div>
                              <div><span className="font-semibold">Created At:</span> {new Date(selectedAccount.createdAt).toLocaleString()}</div>
                              <div><span className="font-semibold">Updated At:</span> {new Date(selectedAccount.updatedAt).toLocaleString()}</div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500">Failed to load account details.</div>
                          )}
                        </Modal>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">{user.department}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[user.role as keyof typeof roleColors]}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">{user.lastLogin}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[user.status as keyof typeof statusColors]}`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required={!editingUser}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Procurement, IT, Finance"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'manager' | 'viewer' })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
                {/* Role Permissions */}
                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <ShieldCheckIcon className="w-3 h-3" />
                    <span>Permissions:</span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {rolePermissions[formData.role].map((perm, idx) => (
                      <li key={idx}>• {perm}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminUsers;