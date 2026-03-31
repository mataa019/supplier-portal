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
}