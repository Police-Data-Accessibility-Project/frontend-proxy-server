import { z } from 'zod';

export const donorBoxSchema = z.object({
  path: z.string().startsWith('/'),
  params: z.record(z.string(), z.string()).optional(),
});

export interface DonorBoxRequestBody {
  path: string;
  params?: Record<string, string>;
}
