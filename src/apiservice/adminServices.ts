


type AppEnv = ImportMetaEnv & {
	VITE_API_BASE_URL?: string
}

const env = import.meta.env as AppEnv
export const API_BASE_URL = import.meta.env.DEV ? '/api' : (env.VITE_API_BASE_URL || '').replace(/\/$/, '')


const getAuthHeaders = (): Record<string, string> => {
	const token = localStorage.getItem('token');
	return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export interface CreateCategoryPayload {
    name: string;
    description: string;
    applicationFee: number;
    requirements: string;
    status: string;
    documentTemplate?: File | {} | null;
}


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

export interface AdminCategory {
  requirements: string;
	id: string;
	name: string;
	description: string;
	applicationFee: number;
	status: string;
	documentTemplate: string;
	createdAt: string;
}

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