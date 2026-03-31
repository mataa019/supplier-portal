import React from 'react';
import { XMarkIcon } from '@heroicons/react/16/solid';

import type { RefObject } from 'react';
interface CategoryModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    name: string;
    description: string;
    requirements: string;
    applicationFee: string;
    documentTemplate: string;
    status: 'active' | 'inactive';
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  setFile: (file: File | null) => void;
  editingCategory: any;
  uploading: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  fileInputRef,
  setFile,
  editingCategory,
  uploading,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <select
              multiple
              value={formData.requirements ? formData.requirements.split(',') : []}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, requirements: selected.join(',') });
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="Application form">Application form</option>
              <option value="Registration Certificate">Registration Certificate</option>
              <option value="Tax certificate">Tax certificate</option>
              <option value="company Profile">company Profile</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Fee (K)</label>
            <input
              type="text"
              value={formData.applicationFee}
              onChange={(e) => setFormData({ ...formData, applicationFee: e.target.value })}
              placeholder="e.g., 2,500"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Template (upload file)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              ref={fileInputRef}
              onChange={e => {
                const f = e.target.files && e.target.files[0];
                setFile(f || null);
                setFormData({ ...formData, documentTemplate: f ? f.name : '' });
              }}
              required={!editingCategory}
            />
            {editingCategory && editingCategory.documentTemplate && (
              <div className="mt-1">
                <a
                  href={editingCategory.documentTemplate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:text-red-700 underline"
                  download={editingCategory.documentTemplate.split('/').pop() || 'template'}
                >
                  Download current Document
                </a>
              </div>
            )}
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
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
              disabled={uploading}
            >
              {uploading ? 'Saving...' : editingCategory ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
