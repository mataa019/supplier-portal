


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
	const formData = new FormData();
	formData.append('name', payload.name);
	formData.append('description', payload.description);
	formData.append('applicationFee', String(payload.applicationFee));
	formData.append('requirements', payload.requirements);
	formData.append('status', payload.status);
	if (payload.documentTemplate && payload.documentTemplate instanceof File) {
        formData.append('documentTemplate', payload.documentTemplate);
    }

	const response = await fetch(`${API_BASE_URL}/admin/suppliers/categories`, {
		method: 'POST',
		headers: {
			...getAuthHeaders(),
			// Do not set Content-Type, browser will set it for FormData
		},
		body: formData,
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || 'Failed to create supplier category');
	}
	return response.json();
};

export interface AdminCategory {
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

// Update a supplier category (admin) using application/json
export const updateAdminSupplierCategory = async (
	categoryId: string,
	payload: Partial<CreateCategoryPayload>
): Promise<any> => {
	// If documentTemplate is a File, convert to empty object (API expects {})
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