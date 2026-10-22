import { z } from 'zod';

const phone = z.string().trim().max(40).optional().or(z.literal(''));
export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128)
});
export const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  position: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone,
  companyName: z.string().trim().min(2).max(160),
  companyEmail: z.string().trim().email().max(160),
  companyPhone: phone,
  companyAddress: z.string().trim().min(5).max(300),
  industry: z.string().trim().min(2).max(100),
  password: z.string().min(10).max(128).regex(/[A-Z]/, 'Add an uppercase letter').regex(/[0-9]/, 'Add a number')
});
export const quoteRequestSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone,
  companyName: z.string().trim().max(160).optional().or(z.literal('')),
  serviceRequired: z.string().trim().min(2).max(160),
  location: z.string().trim().min(2).max(250),
  urgency: z.string().trim().max(50).default('Standard'),
  preferredDate: z.string().optional().or(z.literal('')),
  projectDetails: z.string().trim().min(20).max(5000)
});
export const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone,
  serviceRequired: z.string().trim().max(160).optional().or(z.literal('')),
  projectDetails: z.string().trim().max(1000).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(5000)
});
export const messageSchema = z.object({
  chatId: z.string().cuid(),
  message: z.string().trim().min(1).max(4000),
  isInternal: z.boolean().optional().default(false)
});
export const quotationSchema = z.object({
  quoteRequestId: z.string().cuid().optional().nullable(),
  companyId: z.string().cuid(),
  clientId: z.string().cuid().optional().nullable(),
  issueDate: z.string(),
  expiryDate: z.string(),
  discount: z.coerce.number().min(0).default(0),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().max(5000).optional(),
  terms: z.string().max(5000).optional(),
  status: z.enum(['DRAFT', 'SENT']).default('DRAFT'),
  items: z.array(z.object({
    description: z.string().trim().min(2).max(500),
    quantity: z.coerce.number().positive(),
    unit: z.string().trim().min(1).max(30).default('unit'),
    rate: z.coerce.number().min(0)
  })).min(1)
});
export const jobStatusSchema = z.object({
  jobId: z.string().cuid(),
  status: z.enum(['QUOTED','APPROVED','SCHEDULED','DEPLOYED','IN_PROGRESS','QA_REVIEW','COMPLETED','CANCELLED']),
  progress: z.coerce.number().int().min(0).max(100),
  note: z.string().trim().max(1000).optional()
});
