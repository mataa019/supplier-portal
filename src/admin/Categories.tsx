
import { useState, useRef, useEffect } from 'react';
import {
  createAdminSupplierCategory,
  listAdminSupplierCategories,
  updateAdminSupplierCategory,
  deleteAdminSupplierCategory,
  uploadCategoryTemplateDocument,
  getAdminSupplierCategory,
} from '../apiservice/adminServices';
import { DocumentArrowDownIcon, FolderIcon } from '@heroicons/react/16/solid';
import CategoryModal from './model/CategoryModal';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import type { AdminCategory } from '../apiservice/adminModels';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
};

function Categories() {
  
  const [categories, setCategories] = useState<AdminCategory[]>([]);
    const activeCategories = categories.filter(cat => cat.status === 'active').length;
    // Fetch categories on mount
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const data = await listAdminSupplierCategories();
          setCategories(data);
        } catch (err: any) {
          alert(err.message || 'Failed to fetch categories');
        }
      };
      fetchCategories();
    }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requirements: '',
    applicationFee: '',
    documentTemplate: '', 
    status: 'active' as 'active' | 'inactive',
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      requirements: '',
      applicationFee: '',
      documentTemplate: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const handleEdit = async (category: AdminCategory) => {
    try {
      // Fetch latest category data from API
      const cat = await getAdminSupplierCategory(category.id);
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        description: cat.description,
        requirements: cat.requirements,
        applicationFee: String(cat.applicationFee),
        documentTemplate: cat.documentTemplate || '',
        status: cat.status === 'active' || cat.status === 'inactive' ? cat.status : 'inactive',
      });
      setFile(null);
      setShowModal(true);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch category');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteAdminSupplierCategory(id);
        setCategories(categories.filter((c) => c.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      // Always ensure requirements is a non-empty string
      const requirementsString = Array.isArray(formData.requirements)
        ? formData.requirements.join(',')
        : formData.requirements;
      if (!requirementsString || requirementsString.trim() === '') {
        alert('Please select at least one requirement.');
        setUploading(false);
        return;
      }
      if (!editingCategory && !file) {
        alert('Please upload a document template.');
        setUploading(false);
        return;
      }
  
      if (editingCategory) {
        // Update category
        const payload = {
          name: formData.name,
          description: formData.description,
          applicationFee: Number(formData.applicationFee.replace(/[^\d.]/g, '')),
          requirements: requirementsString,
          status: formData.status,
          documentTemplate: file ? file.name : (editingCategory.documentTemplate || ''),
        };
        await updateAdminSupplierCategory(editingCategory.id, payload);
        // If file uploaded, upload separately
        if (file) {
          await uploadCategoryTemplateDocument(editingCategory.id, file);
        }
      } else {
        // Create new category
        const payload = {
          name: formData.name,
          description: formData.description,
          applicationFee: Number(formData.applicationFee.replace(/[^\d.]/g, '')),
          requirements: requirementsString,
          status: formData.status,
          documentTemplate: file ? file.name : '',
        };
        const created = await createAdminSupplierCategory(payload);
        if (file && created.id) {
          await uploadCategoryTemplateDocument(created.id, file);
        }
      }
      // Refresh categories
      const data = await listAdminSupplierCategories();
      setCategories(data);
      setShowModal(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      alert(err.message || 'Failed to save category');
    } finally {
      setUploading(false);
    }
  };

   return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage supplier categories and application templates</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 justify-center sm:w-auto"
        >
          <PlusIcon className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          <p className="text-sm text-gray-500">Total Categories</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-600">{activeCategories}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <FolderIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[category.status as keyof typeof statusColors]}`}>
                    {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>

            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Application Fee</span>
                <span className="font-semibold text-gray-900">{category.applicationFee}</span>
              </div>
              {/* No suppliersCount field in API, so this section is removed */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Template</span>
                {category.documentTemplate ? (
                  <a
                    href={category.documentTemplate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    download={category.documentTemplate.split('/').pop() || 'template'}
                  >
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    <span className="text-xs">Download</span>
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">No file</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No categories found</p>
        </div>
      )}

      {/* Modal as component */}
      <CategoryModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        fileInputRef={fileInputRef}
        setFile={setFile}
        editingCategory={editingCategory}
        uploading={uploading}
      />
    </div>
  );
}

export default Categories;



