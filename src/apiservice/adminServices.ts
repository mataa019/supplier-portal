import type { SupplierApplication } from './adminModels';


import type { AdminCategory, AdminSupplier, AdminSupplierUser, CreateCategoryPayload } from './adminModels';
// Type for supplier user

type AppEnv = ImportMetaEnv & {
	VITE_API_BASE_URL?: string
}

const env = import.meta.env as AppEnv
export const API_BASE_URL = import.meta.env.DEV ? '/api' : (env.VITE_API_BASE_URL || '').replace(/\/$/, '')


const getAuthHeaders = (): Record<string, string> => {
	const token = localStorage.getItem('token');
	return token ? { 'Authorization': `Bearer ${token}` } : {};
};




// Create a supplier category (admin)
export const createAdminSupplierCategory = async (payload: CreateCategoryPayload): Promise<any> => {
    let bodyPayload = { ...payload };
    if (bodyPayload.documentTemplate && bodyPayload.documentTemplate instanceof File) {
        bodyPayload.documentTemplate = {};
    }
    const response = await fetch(`${API_BASE_URL}/admin/suppliers/categories`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create supplier category');
    }
    return response.json();
};

// (moved to adminModels.ts)

// List all supplier categories (admin)
export const listAdminSupplierCategories = async (): Promise<AdminCategory[]> => {
	const response = await fetch(`${API_BASE_URL}/admin/suppliers/categories`, {
		method: 'GET',
		headers: getAuthHeaders(),
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || 'Failed to fetch categories');
	}
	return response.json();
};


// Update a supplier category (admin)
export const updateAdminSupplierCategory = async (
	categoryId: string,
	payload: Partial<CreateCategoryPayload>
): Promise<any> => {
	let bodyPayload = { ...payload };
	if (bodyPayload.documentTemplate && bodyPayload.documentTemplate instanceof File) {
		bodyPayload.documentTemplate = {};
	}
	const response = await fetch(`${API_BASE_URL}/admin/suppliers/categories/${categoryId}`, {
		method: 'PATCH',
		headers: {
			...getAuthHeaders(),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(bodyPayload),
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || 'Failed to update supplier category');
	}
	return response.json();
};

// Delete a supplier category (admin)
export const deleteAdminSupplierCategory = async (categoryId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/suppliers/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete supplier category');
    }
};
// Upload category template document (admin)
export const uploadCategoryTemplateDocument = async (
  categoryId: string,
  file: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/admin/suppliers/categories/${categoryId}/template`, {
    method: 'POST',
    headers: getAuthHeaders(), 
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload template document');
  }
};
// Get a single supplier category (admin)
export const getAdminSupplierCategory = async (categoryId: string): Promise<AdminCategory> => {
    const response = await fetch(`${API_BASE_URL}/admin/suppliers/categories/${categoryId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch category');
    }
    return response.json();
};

// List all suppliers (admin)
export async function listAdminSuppliers(): Promise<AdminSupplier[]> {
    const res = await fetch(`${API_BASE_URL}/admin/suppliers`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch suppliers');
    }
    const data = await res.json();
    console.log('Fetched suppliers:', data);
    return data;
}

// Get a single supplier (admin)
export async function getAdminSupplier(supplierId: string): Promise<AdminSupplier> {
    const res = await fetch(`${API_BASE_URL}/admin/suppliers/${supplierId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch supplier');
    }
    const data = await res.json();
    console.log('Fetched Single  Supplier:', data);
    return data;
}

// Delete a supplier (admin)
export async function deleteAdminSupplier(supplierId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/suppliers/${supplierId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete supplier');
    }
    console.log(`Deleted supplier with ID: ${supplierId} + response status: ${res.status}`);
}

// List all applications for a supplier (admin)
export async function listSupplierApplications(supplierId: string): Promise<SupplierApplication[]> {
    const res = await fetch(`${API_BASE_URL}/admin/suppliers/${supplierId}/applications`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch supplier applications');
    }
    return res.json();
}

export async function ApproveApplication(applicationId: string, remarks: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/approve`, {
        method: 'PATCH',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ remarks }),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to approve application');
    }
    const data = await res.json();
    console.log('Approved application:', data);
    return data;
}

export async function RejectApplication(applicationId: string, remarks: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/reject`, {
        method: 'PATCH',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ remarks }),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to reject application');
    }
    const data = await res.json();
    console.log('Rejected application:', data);
    return data;
}
