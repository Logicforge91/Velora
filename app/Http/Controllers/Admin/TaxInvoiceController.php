<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTaxInvoiceRequest;
use App\Http\Requests\Admin\UpdateTaxInvoiceRequest;
use App\Models\Order;
use App\Models\TaxInvoice;
use App\Models\User;
use App\Models\Vendor;
use App\Services\Admin\TaxInvoiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaxInvoiceController extends Controller
{
    public function __construct(private readonly TaxInvoiceService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/tax-invoices/index', ['invoices' => $this->service->paginate($request->only(['search', 'status', 'type'])), 'counts' => $this->service->counts(), 'statuses' => TaxInvoice::statuses()]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('admin/tax-invoices/create', ['orders' => Order::query()->select(['id', 'user_id', 'number', 'total', 'shipping_address'])->with(['user:id,name,email', 'items:id,order_id,vendor_id,product_name,total'])->latest('placed_at')->limit(300)->get(), 'vendors' => Vendor::query()->select(['id', 'business_name', 'tax_number', 'address'])->where('status', Vendor::STATUS_APPROVED)->orderBy('business_name')->get(), 'issuedInvoices' => TaxInvoice::query()->select(['id', 'order_id', 'vendor_id', 'number', 'total_amount'])->where('status', 'issued')->where('type', 'invoice')->latest()->limit(300)->get(), 'defaults' => ['order_id' => $request->integer('order_id') ?: null, 'parent_invoice_id' => $request->integer('parent_invoice_id') ?: null]]);
    }

    public function store(StoreTaxInvoiceRequest $request): RedirectResponse
    {
        $invoice = $this->service->create($request->validated());

        return to_route('admin.tax-invoices.show', $invoice)->with('success', 'GST document generated successfully.');
    }

    public function show(TaxInvoice $taxInvoice): Response
    {
        $taxInvoice->load(['order.user', 'vendor', 'parentInvoice', 'items.orderItem', 'issuer']);

        $statuses = match ($taxInvoice->status) {
            'draft' => TaxInvoice::statuses(),
            'issued' => ['issued', 'cancelled'],
            default => ['cancelled'],
        };

        return Inertia::render('admin/tax-invoices/show', ['invoice' => $taxInvoice, 'statuses' => $statuses]);
    }

    public function update(UpdateTaxInvoiceRequest $request, TaxInvoice $taxInvoice): RedirectResponse
    { /** @var User $actor */ $actor = $request->user();
        $this->service->update($taxInvoice, $actor, $request->validated());

        return back()->with('success', 'GST document workflow updated.');
    }
}
