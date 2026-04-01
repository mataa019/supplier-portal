// Application document model
export interface ApplicationDocument {
  id: string;
  applicationId: string;
  type: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

// Application category model (nested in application)
export interface ApplicationCategory {
  id: string;
  name: string;
  description: string;
  applicationFee: number;
  Requirements: string;
  documentTemplate: string;
  status: string;
  createdAt: string;
}

// Supplier application model
export interface SupplierApplication {
  id: string;
  supplierId: string;
  categoryId: string;
  status: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  remarks: string | null;
  createdAt: string;
  category: ApplicationCategory;
  documents: ApplicationDocument[];
  payments: any[];
}

// Payload for creating/updating a category
export interface CreateCategoryPayload {
  name: string;
  description: string;
  applicationFee: number;
  requirements: string;
  status: string;
  documentTemplate?: File | {} | null;
}

// Admin API models
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

export interface AdminSupplierUser {
  id: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
}

export interface AdminSupplier {
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
  user: AdminSupplierUser;
  categories: string[];
}

// Application filters for getAllApplications
export interface ApplicationFilters {
    page?: number;
    limit?: number;
    status?: string;
    categoryId?: string;
    supplierId?: string;
    search?: string;
}
