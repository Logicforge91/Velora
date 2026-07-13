<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AccountRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSupportTicketRequest;
use App\Http\Requests\Admin\UpdateSupportTicketRequest;
use App\Models\Order;
use App\Models\SupportTicket;
use App\Models\User;
use App\Services\Admin\SupportOperationsService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportTicketController extends Controller
{
    public function __construct(private readonly SupportOperationsService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/support/index', ['tickets' => $this->service->paginate($request->only(['search', 'status', 'priority'])), 'counts' => $this->service->counts(), 'statuses' => SupportTicket::statuses(), 'priorities' => SupportTicket::priorities()]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/support/create', ['customers' => User::query()->select(['id', 'name', 'email'])->where('role', AccountRole::Customer->value)->orderBy('name')->limit(500)->get(), 'orders' => Order::query()->select(['id', 'user_id', 'number'])->latest()->limit(500)->get(), 'agents' => $this->agents()]);
    }

    public function store(StoreSupportTicketRequest $request): RedirectResponse
    {
        $ticket = $this->service->create($request->validated());

        return to_route('admin.support.show', $ticket)->with('success', 'Support ticket opened successfully.');
    }

    public function show(SupportTicket $support): Response
    {
        $support->load(['customer', 'order', 'assignee', 'messages' => fn ($query) => $query->with('user:id,name,email')->oldest()]);

        return Inertia::render('admin/support/show', ['ticket' => $support, 'agents' => $this->agents(), 'statuses' => SupportTicket::statuses(), 'priorities' => SupportTicket::priorities()]);
    }

    public function update(UpdateSupportTicketRequest $request, SupportTicket $support): RedirectResponse
    {
        $this->service->update($support, $request->validated());

        return back()->with('success', 'Ticket workflow updated.');
    }

    /** @return Collection<int, User> */
    private function agents(): Collection
    {
        return User::query()->select(['id', 'name', 'email'])->whereIn('role', [AccountRole::Admin->value, AccountRole::SupportAgent->value])->where('status', true)->orderBy('name')->get();
    }
}
