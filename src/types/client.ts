export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
} 