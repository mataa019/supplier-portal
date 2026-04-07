
import type { AdminAccount, ApplicationFilters, AuditLog, AuditLogResponse, CreateAccountPayload, SupplierApplication } from './adminModels';


import type { AdminCategory, AdminSupplier, CreateCategoryPayload } from './adminModels';
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
//APPLICATIONS



export async function getAllApplications(filters: ApplicationFilters = {}): Promise<SupplierApplication[]> {
    const params = new URLSearchParams();
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.limit !== undefined) params.append('limit', String(filters.limit));
    if (filters.status) params.append('status', filters.status);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.supplierId) params.append('supplierId', filters.supplierId);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/admin/applications${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch applications');
    }
    const data = await res.json();
    console.log('Fetched All  applications:', data);
    return data;
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
// Get a single application (admin)
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
// Reject an application (admin)
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
// Withdraw an application (admin)
export async function withdrawApplication(applicationId: string, remarks: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/withdraw`, {
        method: 'PATCH',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ remarks }),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to withdraw application');
    }
    const data = await res.json();
    console.log('Withdrawn application:', data);
    return data;
}
// Download a document for an application (admin)
export async function downloadAdminApplicationDocument(applicationId: string, documentId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/documents/${documentId}/download`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to download document');
    }
    return response.blob();
}
// Download merged documents for an application (admin)
export async function downloadMergedApplicationDocuments(applicationId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/merge-documents`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to download merged document');
    }
    return response.blob();
}


export async function getAuditLogs(params: { page?: number; limit?: number } = {}): Promise<AuditLogResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));
    const query = searchParams.toString() ? `?${searchParams}` : '';
    const res = await fetch(`${API_BASE_URL}/audit${query}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch audit logs');
    }
    return res.json();
}
// Get a single audit log by ID
export async function getAuditLogById(id: string): Promise<AuditLog> {
    const res = await fetch(`${API_BASE_URL}/audit/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch audit log');
    }
    return res.json();
}
// Get all user accounts (admin)
export async function getAllAccounts(): Promise<AdminAccount[]> {
    const res = await fetch(`${API_BASE_URL}/admin/accounts`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error(' Error response:', errorData);
        if (typeof window !== 'undefined' && window.alert) {
            window.alert(errorData.message || 'Failed to fetch accounts');
        }
        throw new Error(errorData.message || 'Failed to fetch accounts');
    }
    const data = await res.json();
    console.log(' Success:', data);
    return data;
}
// Create a new user account (admin)
export async function createAccount(payload: CreateAccountPayload): Promise<AdminAccount> {
    const res = await fetch(`${API_BASE_URL}/admin/accounts`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create account');
    }
    const data = await res.json();
    console.log('Created account:', data);
    return data;
}
// Get a single user account by ID (admin)
export async function getAccountById(id: string): Promise<AdminAccount> {
    const res = await fetch(`${API_BASE_URL}/admin/accounts/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch account');
    }
    const data = await res.json();
    console.log('Fetched account:', data);
    return data;
}

// Update an admin account by ID
export async function updateAccount(id: string, data: { email: string; password?: string; role: string; status: string }) {
  const res = await fetch(`/admin/accounts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update account');
  return res.json();
}
// Delete a user account (admin)
export async function deleteAccount(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/accounts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete account');
    }
}

// Get roles meta (all, assignable, non-assignable)
export async function getRolesMeta(): Promise<{
    allRoles: string[];
    assignableRoles: string[];
    nonAssignableRoles: string[];
}> {
    const res = await fetch(`${API_BASE_URL}/admin/accounts/meta/roles`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch roles meta');
    }
    return res.json();
}
// Create a new admin user (admin only)
export async function createAdminOnly(payload: { email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/register/admin`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create admin');
    }
    return res.json();
}
