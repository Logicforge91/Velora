import { Link, router } from '@inertiajs/react';
import { AlertTriangle, Search, ShieldCheck, Store } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Pagination from '@/components/admin/pagination';
import {
    AdminEmptyState,
    AdminFilterBar,
    AdminPageHeader,
    AdminPanel,
    AdminStatusBadge,
} from '@/components/admin/primitives';
import StatCards from '@/components/admin/stat-cards';
import AdminLayout from '@/layouts/admin-layout';
import vendorsRoutes from '@/routes/admin/vendors';
import type { Counts, Paginated, Vendor } from '@/types/admin';

export default function VendorsIndex({
    vendors,
    counts,
}: {
    vendors: Paginated<Vendor>;
    counts: Counts;
}) {
    const params = new URLSearchParams(location.search);
    const [search, setSearch] = useState(params.get('search') ?? '');
    const [status, setStatus] = useState(params.get('status') ?? '');
    const [kycStatus, setKycStatus] = useState(params.get('kyc_status') ?? '');
    const [riskLevel, setRiskLevel] = useState(params.get('risk_level') ?? '');
    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(
            vendorsRoutes.index.url(),
            { search, status, kyc_status: kycStatus, risk_level: riskLevel },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Sellers" breadcrumb="Marketplace / Sellers">
            <AdminPageHeader
                title="Seller verification center"
                description="Review business identity, KYC completeness, risk signals and activation readiness."
            />
            <div className="mt-6">
                <StatCards
                    cards={[
                        {
                            label: 'Applications',
                            value: counts.all,
                            icon: Store,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10',
                        },
                        {
                            label: 'Pending decision',
                            value: counts.pending,
                            icon: Store,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
                        },
                        {
                            label: 'KYC in review',
                            value: counts.kyc_review,
                            icon: ShieldCheck,
                            tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
                        },
                        {
                            label: 'High risk',
                            value: counts.high_risk,
                            icon: AlertTriangle,
                            tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
                        },
                    ]}
                />
            </div>
            <AdminPanel className="mt-6">
                <AdminFilterBar
                    onSubmit={submit}
                    className="md:grid-cols-[1fr_10rem_10rem_10rem_auto]"
                >
                    <label className="relative">
                        <Search className="absolute top-3 left-3 size-4 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Business, owner or GST number"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 text-sm dark:border-white/10 dark:bg-white/5"
                        />
                    </label>
                    <Select
                        value={status}
                        onChange={setStatus}
                        label="All decisions"
                        options={[
                            'pending',
                            'approved',
                            'rejected',
                            'suspended',
                        ]}
                    />
                    <Select
                        value={kycStatus}
                        onChange={setKycStatus}
                        label="All KYC states"
                        options={[
                            'pending',
                            'in_review',
                            'verified',
                            'rejected',
                        ]}
                    />
                    <Select
                        value={riskLevel}
                        onChange={setRiskLevel}
                        label="All risk levels"
                        options={['unassessed', 'low', 'medium', 'high']}
                    />
                    <button className="rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        Apply
                    </button>
                </AdminFilterBar>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-3">Seller</th>
                                <th className="px-5 py-3">Decision</th>
                                <th className="px-5 py-3">KYC progress</th>
                                <th className="px-5 py-3">Risk</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {vendors.data.map((vendor) => (
                                <tr
                                    key={vendor.id}
                                    className="hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                    <td className="px-6 py-4">
                                        <p className="font-black">
                                            {vendor.business_name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {vendor.user.name} ·{' '}
                                            {vendor.business_email}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <AdminStatusBadge
                                            value={vendor.status}
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-bold capitalize">
                                            {vendor.kyc_status.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {vendor.verified_documents_count ??
                                                0}{' '}
                                            of 5 required verified
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p
                                            className={`text-sm font-black capitalize ${vendor.risk_level === 'high' ? 'text-rose-600' : vendor.risk_level === 'medium' ? 'text-amber-600' : 'text-slate-700 dark:text-slate-200'}`}
                                        >
                                            {vendor.risk_level}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Score {vendor.risk_score}/100
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={vendorsRoutes.show.url(
                                                vendor.id,
                                            )}
                                            className="text-sm font-bold text-indigo-600"
                                        >
                                            Open review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {vendors.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-0">
                                        <AdminEmptyState
                                            icon={Store}
                                            title="No matching sellers"
                                            description="Adjust the verification filters to find another seller application."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={vendors.links} />
            </AdminPanel>
        </AdminLayout>
    );
}

function Select({
    value,
    onChange,
    label,
    options,
}: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    options: string[];
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-white/10 dark:bg-[#101722]"
        >
            <option value="">{label}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option.replaceAll('_', ' ')}
                </option>
            ))}
        </select>
    );
}
