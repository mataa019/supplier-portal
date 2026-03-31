// Model for creating a supplier category
// All fields are required

export interface CreateCategory {
  name: string; // e.g. "General Supplier"
  description: string; // e.g. "For general goods and services suppliers"
  applicationFee: number; // e.g. 500
  requirements: string; // e.g. "Business registration certificate, TPIN certificate, Bank letter"
  status: 'active' | 'inactive'; // e.g. "active"
  documentTemplate: string; // e.g. "string" (URL or file name)
}

// Example usage:
// const example: CreateCategory = {
//   name: "General Supplier",
//   description: "For general goods and services suppliers",
//   applicationFee: 500,
//   requirements: "Business registration certificate, TPIN certificate, Bank letter",
//   status: "active",
//   documentTemplate: "string"
// };
