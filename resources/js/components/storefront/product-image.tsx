import type { StorefrontProduct } from '@/components/storefront/catalog';
import { cn } from '@/lib/utils';

export default function ProductImage({
    product,
    className,
}: {
    product: StorefrontProduct;
    className?: string;
}) {
    return (
        <span
            role="img"
            aria-label={product.name}
            className={cn(
                'block bg-[url(/images/storefront/velora-product-grid.png)] bg-[length:300%_200%] bg-no-repeat',
                className,
            )}
            style={{ backgroundPosition: product.imagePosition }}
        />
    );
}
