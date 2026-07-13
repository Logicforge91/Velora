<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSupportMessageRequest;
use App\Models\SupportTicket;
use App\Models\User;
use App\Services\Admin\SupportOperationsService;
use Illuminate\Http\RedirectResponse;

class SupportMessageController extends Controller
{
    public function __construct(private readonly SupportOperationsService $service) {}

    public function __invoke(StoreSupportMessageRequest $request, SupportTicket $support): RedirectResponse
    { /** @var User $actor */ $actor = $request->user();
        $this->service->addMessage($support, $actor, $request->validated());

        return back()->with('success', 'Support message added.');
    }
}
