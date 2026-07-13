<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCouponRequest;
use App\Http\Requests\Admin\UpdateCouponRequest;
use App\Models\Coupon;
use App\Services\Admin\CouponManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function __construct(private readonly CouponManagementService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/coupons/index', ['coupons' => $this->service->paginate($request->only(['search', 'state'])), 'counts' => $this->service->counts()]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/coupons/form', ['coupon' => new Coupon(['type' => 'percentage', 'minimum_order_amount' => 0, 'status' => true])]);
    }

    public function store(StoreCouponRequest $request): RedirectResponse
    {
        $coupon = $this->service->create($request->validated());

        return to_route('admin.coupons.edit', $coupon)->with('success', 'Promotion created successfully.');
    }

    public function edit(Coupon $coupon): Response
    {
        return Inertia::render('admin/coupons/form', ['coupon' => $coupon]);
    }

    public function update(UpdateCouponRequest $request, Coupon $coupon): RedirectResponse
    {
        $this->service->update($coupon, $request->validated());

        return to_route('admin.coupons.edit', $coupon)->with('success', 'Promotion updated successfully.');
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        $this->service->delete($coupon);

        return to_route('admin.coupons.index')->with('success', 'Promotion deleted successfully.');
    }
}
