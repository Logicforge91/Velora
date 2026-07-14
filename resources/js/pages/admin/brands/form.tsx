import CatalogueForm from '@/components/admin/catalogue-form';
import AdminLayout from '@/layouts/admin-layout';
import brandsRoutes from '@/routes/admin/brands';
import type { Brand } from '@/types/admin';

export default function BrandForm({ brand }: { brand: Brand }) {
    const exists = Boolean(brand.id);

    return (
        <AdminLayout
            title={exists ? 'Edit Brand' : 'Create Brand'}
            breadcrumb={`Brands / ${exists ? 'Edit' : 'Create'}`}
        >
            <CatalogueForm
                kind="brand"
                item={brand}
                submitUrl={
                    exists
                        ? brandsRoutes.update.url(brand.id)
                        : brandsRoutes.store.url()
                }
                method={exists ? 'put' : 'post'}
                cancelUrl={brandsRoutes.index.url()}
            />
        </AdminLayout>
    );
}
