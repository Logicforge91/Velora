import CatalogueForm from '@/components/admin/catalogue-form';
import AdminLayout from '@/layouts/admin-layout';
import categoriesRoutes from '@/routes/admin/categories';
import type { Category } from '@/types/admin';

export default function CategoryForm({ category, parentOptions }: { category: Category; parentOptions: Category[] }) {
 const exists = Boolean(category.id);

 return <AdminLayout title={exists ? 'Edit Category' : 'Create Category'} breadcrumb={`Categories / ${exists ? 'Edit' : 'Create'}`}><CatalogueForm kind="category" item={category} parentOptions={parentOptions} submitUrl={exists ? categoriesRoutes.update.url(category.id) : categoriesRoutes.store.url()} method={exists ? 'put' : 'post'} cancelUrl={categoriesRoutes.index.url()} /></AdminLayout>; 
}
