<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ModerateReviewRequest;
use App\Models\Review;
use App\Services\Admin\ReviewModerationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(private readonly ReviewModerationService $service) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/reviews/index', ['reviews' => $this->service->paginate($request->only(['search', 'status', 'rating'])), 'counts' => $this->service->counts()]);
    }

    public function update(ModerateReviewRequest $request, Review $review): RedirectResponse
    {
        $this->service->moderate($review, $request->user(), $request->validated('status'));

        return back()->with('success', 'Review moderation status updated.');
    }
}
