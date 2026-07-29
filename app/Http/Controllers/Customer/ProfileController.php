<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\DeleteDeviceRequest;
use App\Http\Requests\Customer\UpdateProfileRequest;
use App\Http\Requests\Customer\UploadProfileImageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        abort_unless($request->user()->isCustomer(), 403);

        return Inertia::render('customer/profile', [
            'joinedAt' => $request->user()->created_at->toDateString(),
            'addresses' => $request->user()->addresses()->latest('is_default_shipping')->get(),
            'savedPaymentMethods' => $request->user()->orders()
                ->with('payment.transactions')
                ->latest()
                ->limit(20)
                ->get()
                ->flatMap(fn ($order) => $order->payment?->transactions ?? [])
                ->pluck('metadata.method')
                ->filter()
                ->unique()
                ->values(),
            'devices' => DB::table('sessions')
                ->where('user_id', $request->user()->id)
                ->latest('last_activity')
                ->get(['id', 'ip_address', 'user_agent', 'last_activity'])
                ->map(fn ($session): array => [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_active_at' => now()->setTimestamp($session->last_activity)->toISOString(),
                    'current' => $session->id === $request->session()->getId(),
                ]),
        ]);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('customer.profile.edit')
            ->with('success', 'Your profile has been updated.');
    }

    public function uploadAvatar(UploadProfileImageRequest $request): RedirectResponse
    {
        $user = $request->user();
        $path = $request->file('avatar')->store("avatars/{$user->id}", 'public');

        if ($user->avatar && str_starts_with($user->avatar, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
        }

        $user->update(['avatar' => Storage::url($path)]);

        return back()->with('success', 'Profile image updated.');
    }

    public function destroyDevice(DeleteDeviceRequest $request): RedirectResponse
    {
        abort_if($request->validated('session_id') === $request->session()->getId(), 422, 'The current device cannot be removed here.');

        DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->where('id', $request->validated('session_id'))
            ->delete();

        return back()->with('success', 'Device signed out.');
    }

    public function export(Request $request): StreamedResponse
    {
        abort_unless($request->user()->isCustomer(), 403);
        $user = $request->user()->load([
            'addresses',
            'orders.items',
            'orders.payment.refunds',
            'wishlists',
        ]);
        $payload = $user->only([
            'name', 'email', 'phone', 'date_of_birth', 'gender', 'locale',
            'preferred_currency', 'communication_preferences', 'privacy_settings',
            'created_at',
        ]) + [
            'addresses' => $user->addresses,
            'orders' => $user->orders,
            'wishlists' => $user->wishlists,
        ];

        return response()->streamDownload(
            fn () => print json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
            'velora-personal-data.json',
            ['Content-Type' => 'application/json'],
        );
    }
}
