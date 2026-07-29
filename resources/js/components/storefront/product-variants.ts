import type { StorefrontProduct } from '@/components/storefront/catalog';

export type VariantSelections = {
    size: string;
    color: string;
    storage: string;
    weight: string;
    packSize: string;
};

export type ProductVariant = VariantSelections & {
    id: string;
    price: number;
    originalPrice: number;
    stock: number;
    sku: string;
    imagePosition: string;
};

export type VariantDimension = keyof VariantSelections;

export const variantLabels: Record<VariantDimension, string> = {
    size: 'Size',
    color: 'Color',
    storage: 'Storage',
    weight: 'Weight',
    packSize: 'Pack size',
};

const imagePositions = [
    '0% 0%',
    '50% 0%',
    '100% 0%',
    '0% 100%',
    '50% 100%',
    '100% 100%',
];

export function createProductVariants(
    product: StorefrontProduct,
): ProductVariant[] {
    const storageOptions = ['Mobiles', 'Electronics'].includes(product.category)
        ? ['128 GB', '256 GB']
        : ['Standard'];
    const weightOptions = ['Home', 'Fashion'].includes(product.category)
        ? ['500 g', '1 kg']
        : ['Standard'];
    const packSizeOptions = ['Home', 'Accessories'].includes(product.category)
        ? ['Pack of 1', 'Pack of 2']
        : ['Single'];
    const variants: ProductVariant[] = [];

    product.sizes.forEach((size, sizeIndex) => {
        product.colors.forEach((color, colorIndex) => {
            storageOptions.forEach((storage, storageIndex) => {
                weightOptions.forEach((weight, weightIndex) => {
                    packSizeOptions.forEach((packSize, packIndex) => {
                        const combinationIndex =
                            sizeIndex +
                            colorIndex +
                            storageIndex +
                            weightIndex +
                            packIndex;
                        const isUnavailable =
                            product.stock === 0 || combinationIndex % 7 === 5;
                        const priceAdjustment =
                            sizeIndex * 150 +
                            storageIndex * 3000 +
                            weightIndex * 250 +
                            packIndex * 450;

                        variants.push({
                            id: `${product.id}-${sizeIndex}-${colorIndex}-${storageIndex}-${weightIndex}-${packIndex}`,
                            size,
                            color,
                            storage,
                            weight,
                            packSize,
                            price: product.price + priceAdjustment,
                            originalPrice: product.original + priceAdjustment,
                            stock: isUnavailable
                                ? 0
                                : Math.max(
                                      1,
                                      product.stock - combinationIndex * 2,
                                  ),
                            sku: `VEL-${product.id.toString().padStart(3, '0')}-${sizeIndex + 1}${colorIndex + 1}${storageIndex + 1}${weightIndex + 1}${packIndex + 1}`,
                            imagePosition:
                                imagePositions[
                                    (colorIndex + sizeIndex) %
                                        imagePositions.length
                                ],
                        });
                    });
                });
            });
        });
    });

    return variants;
}

export function variantOptions(
    variants: ProductVariant[],
    dimension: VariantDimension,
): string[] {
    return [...new Set(variants.map((variant) => variant[dimension]))];
}

export function variantMatches(
    variant: ProductVariant,
    selections: VariantSelections,
): boolean {
    return (Object.keys(selections) as VariantDimension[]).every(
        (dimension) => variant[dimension] === selections[dimension],
    );
}
