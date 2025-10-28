
import { z } from 'zod';

export type ValidationResult = {
  success: boolean;
  errors: Record<string, string>;
};

export const jobFormSchema = z.object({
  jobName: z.string()
    .min(1, { message: 'Nama job harus diisi' })
    .trim(),
  
  jobType: z.string()
    .min(1, { message: 'Tipe job harus diisi' })
    .trim(),
  
  description: z.string()
    .min(1, { message: 'Deskripsi job harus diisi' })
    .trim(),
  
  candidatesNeeded: z.coerce.number()
    .int({ message: 'Jumlah kandidat harus berupa bilangan bulat' })
    .positive({ message: 'Jumlah kandidat harus berupa angka positif' }),
  
  minSalary: z.coerce.number()
    .nonnegative({ message: 'Gaji minimum harus berupa angka non-negatif' }),
  
  maxSalary: z.coerce.number()
    .nonnegative({ message: 'Gaji maksimum harus berupa angka non-negatif' }),
  
  status: z.string().optional()
})
.refine(data => data.maxSalary >= data.minSalary, {
  message: 'Gaji maksimum harus lebih besar atau sama dengan gaji minimum',
  path: ['maxSalary']
});


export type JobFormData = z.infer<typeof jobFormSchema>;

export const validateJobForm = (formData: any): ValidationResult => {
  try {

    jobFormSchema.parse(formData);
    
    return {
      success: true,
      errors: {}
    };
  } catch (error: any) {
    const errors: Record<string, string> = {};
    
    if (error && error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err: any) => {
        if (err && err.path && Array.isArray(err.path) && err.path.length > 0) {
          const field = String(err.path[0]);
          errors[field] = err.message;
        }
      });
    }
    
    if (Object.keys(errors).length === 0) {
      errors.form = 'Terjadi kesalahan validasi';
    }
    
    return {
      success: false,
      errors
    };
  }
};