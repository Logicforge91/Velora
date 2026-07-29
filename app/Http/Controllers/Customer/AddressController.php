<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreAddressRequest;
use App\Http\Requests\Customer\UpdateAddressRequest;
use App\Models\Address;
use App\Models\ServiceArea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Address::class);

        return Inertia::render('customer/addresses/index', [
            'addresses' => $request->user()->addresses()
                ->latest('is_default_shipping')
                ->latest()
                ->get(),
            'serviceablePostalCodes' => ServiceArea::query()
                ->where('status', 'active')
                ->distinct()
                ->orderBy('postal_code')
                ->pluck('postal_code'),
        ]);
    }

    public function store(StoreAddressRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $data = $request->validated();
            $data['is_serviceable'] = $this->isServiceable($data['postal_code']);

            if ($request->boolean('is_default_shipping') || $request->user()->addresses()->doesntExist()) {
                $request->user()->addresses()->update(['is_default_shipping' => false]);
                $data['is_default_shipping'] = true;
            }

            $request->user()->addresses()->create($data);
        });

        return to_route('customer.addresses.index')
            ->with('success', 'Address added.');
    }

    public function update(UpdateAddressRequest $request, Address $address): RedirectResponse
    {
        DB::transaction(function () use ($request, $address): void {
            $data = $request->validated();
            $data['is_serviceable'] = $this->isServiceable($data['postal_code']);

            if ($request->boolean('is_default_shipping')) {
                $request->user()->addresses()
                    ->whereKeyNot($address->getKey())
                    ->update(['is_default_shipping' => false]);
            }

            $address->update($data);
        });

        return to_route('customer.addresses.index')
            ->with('success', 'Address updated.');
    }

    public function destroy(Request $request, Address $address): RedirectResponse
    {
        Gate::authorize('delete', $address);
        $wasDefault = $address->is_default_shipping;

        DB::transaction(function () use ($request, $address, $wasDefault): void {
            $address->delete();

            if ($wasDefault) {
                $request->user()->addresses()->latest()->first()?->update([
                    'is_default_shipping' => true,
                ]);
            }
        });

        return to_route('customer.addresses.index')
            ->with('success', 'Address removed.');
    }

    public function setDefault(Request $request, Address $address): RedirectResponse
    {
        Gate::authorize('update', $address);

        DB::transaction(function () use ($request, $address): void {
            $request->user()->addresses()->update(['is_default_shipping' => false]);
            $address->update(['is_default_shipping' => true]);
        });

        return to_route('customer.addresses.index')
            ->with('success', 'Default delivery address updated.');
    }

    private function isServiceable(string $postalCode): bool
    {
        return ServiceArea::query()
            ->where('postal_code', $postalCode)
            ->where('status', 'active')
            ->exists();
    }
}
