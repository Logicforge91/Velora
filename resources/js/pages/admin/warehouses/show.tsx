import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Boxes, MapPin, Pencil, Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import routes from '@/routes/admin/warehouses';
import type { Warehouse, WarehouseInventory } from '@/types/admin';

type ProductOption = { id: number; name: string; sku: string };
const control =
    'h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]';

export default function WarehouseShow({
    warehouse,
    products,
}: {
    warehouse: Warehouse;
    products: ProductOption[];
}) {
    const inventories = warehouse.inventories ?? [];
    const total = inventories.reduce((sum, item) => sum + item.on_hand, 0);
    const reserved = inventories.reduce((sum, item) => sum + item.reserved, 0);

    return (
        <AdminLayout
            title={warehouse.name}
            breadcrumb="Fulfilment / Warehouses / Inventory"
        >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <Link
                    href={routes.index.url()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600"
                >
                    <ArrowLeft className="size-4" /> Warehouse network
                </Link>
                <Link
                    href={routes.edit.url(warehouse.id)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold dark:border-white/10"
                >
                    <Pencil className="size-4" /> Edit node
                </Link>
            </div>
            <header className="mt-5 rounded-2xl bg-slate-950 p-6 text-white dark:bg-white/10">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <p className="text-xs font-black tracking-widest text-orange-400 uppercase">
                            {warehouse.code} ·{' '}
                            {warehouse.type.replaceAll('_', ' ')}
                        </p>
                        <h2 className="mt-2 text-2xl font-black">
                            {warehouse.name}
                        </h2>
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                            <MapPin className="size-4" />{' '}
                            {warehouse.address.line_1}, {warehouse.city},{' '}
                            {warehouse.state} {warehouse.postal_code}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <Metric label="SKUs" value={inventories.length} />
                        <Metric label="On hand" value={total} />
                        <Metric label="Available" value={total - reserved} />
                    </div>
                </div>
            </header>
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                        <Plus className="size-5" />
                    </span>
                    <div>
                        <h2 className="font-black">Add inventory position</h2>
                        <p className="text-xs text-slate-500">
                            Assign a product to this node or update an existing
                            position.
                        </p>
                    </div>
                </div>
                <div className="mt-5">
                    <InventoryForm
                        warehouseId={warehouse.id}
                        products={products}
                    />
                </div>
            </section>
            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                <div className="border-b border-slate-200 p-5 dark:border-white/10">
                    <h2 className="font-black">Bin-level inventory</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        On-hand, reservations and reorder thresholds by SKU.
                    </p>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {inventories.map((inventory) => (
                        <InventoryRow
                            key={inventory.id}
                            warehouseId={warehouse.id}
                            inventory={inventory}
                        />
                    ))}
                    {inventories.length === 0 && (
                        <div className="p-14 text-center">
                            <Boxes className="mx-auto size-8 text-slate-300" />
                            <p className="mt-3 text-sm text-slate-500">
                                No inventory has been assigned to this node.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </AdminLayout>
    );
}

function InventoryForm({
    warehouseId,
    products,
}: {
    warehouseId: number;
    products: ProductOption[];
}) {
    const form = useForm({
        product_id: '',
        on_hand: 0,
        reserved: 0,
        reorder_level: 5,
        bin_location: '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(routes.inventory.update.url(warehouseId), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <form
            onSubmit={submit}
            className="grid gap-3 md:grid-cols-[minmax(14rem,1fr)_8rem_8rem_8rem_9rem_auto]"
        >
            <select
                value={form.data.product_id}
                onChange={(e) => form.setData('product_id', e.target.value)}
                className={control}
            >
                <option value="">Select product</option>
                {products.map((product) => (
                    <option key={product.id} value={product.id}>
                        {product.name} · {product.sku}
                    </option>
                ))}
            </select>
            <NumberInput
                value={form.data.on_hand}
                setValue={(value) => form.setData('on_hand', value)}
                placeholder="On hand"
            />
            <NumberInput
                value={form.data.reserved}
                setValue={(value) => form.setData('reserved', value)}
                placeholder="Reserved"
            />
            <NumberInput
                value={form.data.reorder_level}
                setValue={(value) => form.setData('reorder_level', value)}
                placeholder="Reorder"
            />
            <input
                value={form.data.bin_location}
                onChange={(e) => form.setData('bin_location', e.target.value)}
                placeholder="Bin A-01"
                className={control}
            />
            <button
                disabled={form.processing}
                className="rounded-xl bg-orange-500 px-4 text-sm font-bold text-white"
            >
                Save
            </button>
            <Errors errors={form.errors} />
        </form>
    );
}

function InventoryRow({
    warehouseId,
    inventory,
}: {
    warehouseId: number;
    inventory: WarehouseInventory;
}) {
    const form = useForm({
        product_id: inventory.product_id.toString(),
        on_hand: inventory.on_hand,
        reserved: inventory.reserved,
        reorder_level: inventory.reorder_level,
        bin_location: inventory.bin_location ?? '',
    });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(routes.inventory.update.url(warehouseId), {
            preserveScroll: true,
        });
    };
    const available = form.data.on_hand - form.data.reserved;

    return (
        <form
            onSubmit={submit}
            className="grid gap-3 p-5 xl:grid-cols-[minmax(14rem,1fr)_8rem_8rem_8rem_9rem_7rem_auto] xl:items-end"
        >
            <input type="hidden" value={form.data.product_id} readOnly />
            <div>
                <p className="font-black">{inventory.product.name}</p>
                <p className="text-xs text-slate-500">
                    {inventory.product.sku} · Available {available}
                </p>
            </div>
            <Label text="On hand">
                <NumberInput
                    value={form.data.on_hand}
                    setValue={(value) => form.setData('on_hand', value)}
                />
            </Label>
            <Label text="Reserved">
                <NumberInput
                    value={form.data.reserved}
                    setValue={(value) => form.setData('reserved', value)}
                />
            </Label>
            <Label text="Reorder">
                <NumberInput
                    value={form.data.reorder_level}
                    setValue={(value) => form.setData('reorder_level', value)}
                />
            </Label>
            <Label text="Bin">
                <input
                    value={form.data.bin_location}
                    onChange={(e) =>
                        form.setData('bin_location', e.target.value)
                    }
                    className={control}
                />
            </Label>
            <span
                className={`mb-2 rounded-full px-2 py-1 text-center text-[10px] font-black uppercase ${form.data.on_hand <= form.data.reorder_level ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10'}`}
            >
                {form.data.on_hand <= form.data.reorder_level
                    ? 'Reorder'
                    : 'Healthy'}
            </span>
            <button
                disabled={form.processing}
                className="h-10 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
            >
                Update
            </button>
            <Errors errors={form.errors} />
        </form>
    );
}

function NumberInput({
    value,
    setValue,
    placeholder,
}: {
    value: number;
    setValue: (value: number) => void;
    placeholder?: string;
}) {
    return (
        <input
            type="number"
            min="0"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder={placeholder}
            className={control}
        />
    );
}
function Label({
    text,
    children,
}: {
    text: string;
    children: React.ReactNode;
}) {
    return (
        <label className="text-[10px] font-bold text-slate-500 uppercase">
            {text}
            <span className="mt-1 block">{children}</span>
        </label>
    );
}
function Errors({ errors }: { errors: Partial<Record<string, string>> }) {
    const first = Object.values(errors)[0];

    return first ? (
        <p className="text-xs text-rose-600 md:col-span-full">{first}</p>
    ) : null;
}
function Metric({ label, value }: { label: string; value: number }) {
    return (
        <div className="text-right">
            <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                {label}
            </p>
            <p className="mt-1 text-xl font-black">{value.toLocaleString()}</p>
        </div>
    );
}
