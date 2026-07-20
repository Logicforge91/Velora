<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdministrationService;
use Inertia\Inertia;
use Inertia\Response;

class AdministrationController extends Controller
{
    public function __construct(private readonly AdministrationService $service) {}

    public function __invoke(): Response
    {
        return Inertia::render('admin/administration/index', [
            'metrics' => $this->service->metrics(),
        ]);
    }
}
