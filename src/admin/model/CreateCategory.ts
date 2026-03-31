// Model for creating a supplier category
// All fields are required

export interface CreateCategory {
  name: string; 
  description: string; 
  applicationFee: number; 
  requirements: string; 
  status: 'active' | 'inactive'; 
  documentTemplate: string; 
}

