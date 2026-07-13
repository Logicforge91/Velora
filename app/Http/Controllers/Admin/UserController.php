<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Services\Admin\UserManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserManagementService $userService,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/users/index', [
            'users' => $this->userService->getUsers($request->only(['search', 'role', 'status'])),
            'counts' => $this->userService->getCounts(),
            'roles' => $this->userService->getRoles(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/form', [
            'managedUser' => new User(['status' => true, 'role' => 'customer']),
            'roles' => $this->userService->getRoles(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = $this->userService->create(
            data: $request->validated(),
            actor: $request->user(),
            ipAddress: $request->ip(),
        );

        return redirect()
            ->route('admin.users.show', $user)
            ->with('success', 'User created successfully.');
    }

    public function show(User $user): Response
    {
        return Inertia::render('admin/users/show', [
            'managedUser' => $user,
            'recentHistory' => $user->histories()
                ->with('actor:id,name,email')
                ->latest()
                ->limit(6)
                ->get(),
            'roles' => $this->userService->getRoles(),
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/form', [
            'managedUser' => $user,
            'roles' => $this->userService->getRoles(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->userService->update(
            user: $user,
            data: $request->validated(),
            actor: $request->user(),
            ipAddress: $request->ip(),
        );

        return redirect()
            ->route('admin.users.show', $user)
            ->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->userService->delete($user, $request->user(), $request->ip());

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function history(int $user): Response
    {
        $managedUser = User::withTrashed()->findOrFail($user);

        return Inertia::render('admin/users/history', [
            'managedUser' => $managedUser,
            'history' => $this->userService->getHistory($managedUser),
            'roles' => $this->userService->getRoles(),
        ]);
    }
}
