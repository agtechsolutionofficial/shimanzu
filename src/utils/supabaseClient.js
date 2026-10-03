// DEPRECATED: Supabase has been completely removed.
// All database operations and image storage are now powered by MongoDB Atlas and Cloudinary.
export {
  mongoApi as supabaseApi,
  mongoApi,
  normalizeProduct,
  normalizeCategory
} from './apiClient';
