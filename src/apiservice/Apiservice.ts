type AppEnv = ImportMetaEnv & {
	VITE_API_BASE_URL?: string
}

const env = import.meta.env as AppEnv

// Use /api proxy in development to avoid CORS
export const API_BASE_URL = import.meta.env.DEV ? '/api' : (env.VITE_API_BASE_URL || '').replace(/\/$/, '')


export const createApiUrl = (endpoint: string) => {
	const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
	return `${API_BASE_URL}${normalizedEndpoint}`
}
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

// Supplier Category Type
export interface SupplierCategory {
  id: string;
  name: string;
  description: string;
  applicationFee: number;
  Requirements: string;
  status: string;
  createdAt: string;
  documentTemplate: string;
  hasTemplateDocument: boolean;
  templateDownloadUrl: string;
}

// Fetch all supplier categories
export const fetchSupplierCategories = async (): Promise<SupplierCategory[]> => {
  const response = await fetch(createApiUrl('/suppliers/categories'), {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch supplier categories');
  }
  return response.json();
};

// Fetch a supplier category by ID
export const fetchSupplierCategoryById = async (categoryId: string): Promise<SupplierCategory> => {
  const response = await fetch(createApiUrl(`/suppliers/categories/${categoryId}`), {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch supplier category');
  }
  return response.json();
};

// Download supplier category template document
export const downloadSupplierCategoryTemplate = async (categoryId: string): Promise<Blob> => {
  const response = await fetch(createApiUrl(`/suppliers/categories/${categoryId}/template`), {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Template document not found on server');
  }
  return response.blob();
};

export interface RegisterPayload {
  companyName: string
  registrationNumber: string
  tpin: string
  phone: string
  email: string
  password: string
}

export const registerSupplier = async (payload: RegisterPayload) => {
  const response = await fetch(createApiUrl('/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Registration failed')
  }

  return response.json()
}

export interface LoginPayload {
  email: string
  password: string
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await fetch(createApiUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Login failed Check your connection')
  }

  return response.json()
}

export interface VerifyOtpPayload {
  otp: string
  email?: string
}

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const response = await fetch(createApiUrl('/auth/verify-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'OTP verification failed')
  }

  return response.json()
}

export interface ResendOtpPayload {
  email: string
}

export const resendOtp = async (payload: ResendOtpPayload) => {
  const response = await fetch(createApiUrl('/auth/resend-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Resend OTP failed')
  }

  return response.json()
}


// Types for /auth/profile endpoint
export interface SupplierProfile {
  id: string;
  userId: string;
  companyName: string;
  tpin: string;
  registrationNumber: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  supplier: SupplierProfile;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch(createApiUrl('/auth/profile'), {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch profile');
  }
  return response.json();
};

// Create Application endpoint
export interface CreateApplicationPayload {
  categoryId: string;
}
export interface ApplicationResponse {
  id: string;
  categoryId: string;
  status: string;
  createdAt: string;
}
export const createApplication = async (payload: CreateApplicationPayload): Promise<ApplicationResponse> => {
  const response = await fetch(createApiUrl('/application'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create application');
  }
  return response.json();
};

// Upload document to application
export interface UploadApplicationDocumentParams {
  applicationId: string;
  file: File;
  type: string;
  description?: string;
}

export const uploadApplicationDocument = async ({ applicationId, file, type, description }: UploadApplicationDocumentParams): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  if (description) formData.append('description', description);

  const response = await fetch(createApiUrl(`/applications/${applicationId}/documents`), {
    method: 'POST',
    headers: {
      ...(getAuthHeaders().Authorization ? { 'Authorization': getAuthHeaders().Authorization } : {})
      // Do not set Content-Type for FormData; browser will set it
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload document');
  }
};


