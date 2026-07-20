<?php

namespace App\Services\Admin;

use App\Models\RiskRestriction;
use App\Models\RiskRule;
use App\Models\TrustSafetyCase;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class TrustSafetyService
{
    /** @var array<string, array{label: string, group: string, description: string, kind: string, value: string|null}> */
    private const SECTIONS = [
        'fraudulent-orders' => ['label' => 'Fraudulent Orders', 'group' => 'Fraud monitoring', 'description' => 'Orders flagged by velocity, identity, or fulfilment signals.', 'kind' => 'case', 'value' => 'fraudulent_order'],
        'suspicious-transactions' => ['label' => 'Suspicious Transactions', 'group' => 'Fraud monitoring', 'description' => 'Payment activity requiring investigation or escalation.', 'kind' => 'case', 'value' => 'suspicious_transaction'],
        'seller-fraud-alerts' => ['label' => 'Seller Fraud Alerts', 'group' => 'Fraud monitoring', 'description' => 'Risk signals linked to seller conduct and payouts.', 'kind' => 'case', 'value' => 'seller_fraud'],
        'customer-fraud-alerts' => ['label' => 'Customer Fraud Alerts', 'group' => 'Fraud monitoring', 'description' => 'Account, refund, and purchase-abuse indicators.', 'kind' => 'case', 'value' => 'customer_fraud'],
        'fake-product-reports' => ['label' => 'Fake Product Reports', 'group' => 'Product integrity', 'description' => 'Product authenticity reports awaiting validation.', 'kind' => 'case', 'value' => 'fake_product'],
        'counterfeit-complaints' => ['label' => 'Counterfeit Complaints', 'group' => 'Product integrity', 'description' => 'Customer and rights-owner counterfeit complaints.', 'kind' => 'case', 'value' => 'counterfeit'],
        'policy-violations' => ['label' => 'Policy Violations', 'group' => 'Marketplace policy', 'description' => 'Marketplace policy breaches across actors and content.', 'kind' => 'case', 'value' => 'policy_violation'],
        'listing-violations' => ['label' => 'Listing Violations', 'group' => 'Marketplace policy', 'description' => 'Misleading, prohibited, or incomplete listing cases.', 'kind' => 'case', 'value' => 'listing_violation'],
        'pricing-violations' => ['label' => 'Pricing Violations', 'group' => 'Marketplace policy', 'description' => 'Pricing manipulation and policy exception investigations.', 'kind' => 'case', 'value' => 'pricing_violation'],
        'seller-penalties' => ['label' => 'Seller Penalties', 'group' => 'Enforcement', 'description' => 'Warnings, holds, restrictions, and seller penalties.', 'kind' => 'case', 'value' => 'seller_penalty'],
        'blocked-ip-addresses' => ['label' => 'Blocked IP Addresses', 'group' => 'Enforcement', 'description' => 'Network addresses denied marketplace access.', 'kind' => 'restriction', 'value' => 'ip'],
        'blacklisted-customers' => ['label' => 'Blacklisted Customers', 'group' => 'Enforcement', 'description' => 'Customer accounts restricted after risk review.', 'kind' => 'restriction', 'value' => 'customer'],
        'blacklisted-sellers' => ['label' => 'Blacklisted Sellers', 'group' => 'Enforcement', 'description' => 'Seller accounts barred from marketplace activity.', 'kind' => 'restriction', 'value' => 'seller'],
        'risk-rules' => ['label' => 'Risk Rules', 'group' => 'Risk operations', 'description' => 'Configured detection rules, actions, and match volume.', 'kind' => 'rule', 'value' => null],
        'manual-review-queue' => ['label' => 'Manual Review Queue', 'group' => 'Risk operations', 'description' => 'Open and in-review cases requiring analyst decisions.', 'kind' => 'queue', 'value' => null],
    ];

    /** @return list<string> */
    public static function sectionKeys(): array
    {
        return array_keys(self::SECTIONS);
    }

    /**
     * @param  array{section?: string, search?: string|null, status?: string|null, severity?: string|null}  $filters
     * @return array<string, mixed>
     */
    public function workspace(array $filters): array
    {
        $key = $filters['section'] ?? 'manual-review-queue';

        if (! array_key_exists($key, self::SECTIONS)) {
            $key = 'manual-review-queue';
        }

        $section = self::SECTIONS[$key];
        $counts = $this->sectionCounts();

        return [
            'catalog' => collect(self::SECTIONS)->map(fn (array $item, string $itemKey): array => [
                'key' => $itemKey,
                'label' => $item['label'],
                'group' => $item['group'],
                'count' => $counts[$itemKey] ?? 0,
            ])->values()->all(),
            'filters' => ['section' => $key, 'search' => $filters['search'] ?? '', 'status' => $filters['status'] ?? '', 'severity' => $filters['severity'] ?? ''],
            'section' => ['key' => $key, 'label' => $section['label'], 'description' => $section['description'], 'kind' => $section['kind']],
            'metrics' => $this->metrics(),
            'rows' => $this->rows($section, $filters),
        ];
    }

    /** @param array{status: string, severity: string, resolution_notes?: string|null} $data */
    public function review(TrustSafetyCase $case, array $data, User $reviewer): TrustSafetyCase
    {
        return DB::transaction(function () use ($case, $data, $reviewer): TrustSafetyCase {
            $locked = TrustSafetyCase::query()->lockForUpdate()->findOrFail($case->id);
            $isClosed = in_array($data['status'], ['resolved', 'dismissed'], true);
            $locked->update([
                ...$data,
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
                'resolved_at' => $isClosed ? now() : null,
            ]);

            return $locked->refresh();
        });
    }

    /** @return array<string, int> */
    private function metrics(): array
    {
        $cases = TrustSafetyCase::query()->toBase()
            ->selectRaw("COUNT(CASE WHEN status IN ('open', 'in_review') THEN 1 END) as open_cases")
            ->selectRaw("COUNT(CASE WHEN severity IN ('high', 'critical') AND status IN ('open', 'in_review') THEN 1 END) as high_risk")
            ->selectRaw("COUNT(CASE WHEN status = 'in_review' THEN 1 END) as in_review")
            ->first();

        return [
            'open_cases' => (int) ($cases?->open_cases ?? 0),
            'high_risk' => (int) ($cases?->high_risk ?? 0),
            'in_review' => (int) ($cases?->in_review ?? 0),
            'active_restrictions' => RiskRestriction::query()->where('active', true)->count(),
            'active_rules' => RiskRule::query()->where('enabled', true)->count(),
        ];
    }

    /** @return array<string, int> */
    private function sectionCounts(): array
    {
        $caseCounts = TrustSafetyCase::query()->whereIn('status', ['open', 'in_review'])->selectRaw('category, COUNT(*) as total')->groupBy('category')->pluck('total', 'category');
        $restrictionCounts = RiskRestriction::query()->where('active', true)->selectRaw('type, COUNT(*) as total')->groupBy('type')->pluck('total', 'type');
        $activeRuleCount = RiskRule::query()->where('enabled', true)->count();
        $queueCount = TrustSafetyCase::query()->whereIn('status', ['open', 'in_review'])->count();

        return collect(self::SECTIONS)->mapWithKeys(function (array $section, string $key) use ($activeRuleCount, $caseCounts, $queueCount, $restrictionCounts): array {
            $count = match ($section['kind']) {
                'case' => is_string($section['value']) ? (int) $caseCounts->get($section['value'], 0) : 0,
                'restriction' => is_string($section['value']) ? (int) $restrictionCounts->get($section['value'], 0) : 0,
                'rule' => $activeRuleCount,
                'queue' => $queueCount,
                default => 0,
            };

            return [$key => $count];
        })->all();
    }

    /**
     * @param  array{label: string, group: string, description: string, kind: string, value: string|null}  $section
     * @param  array{section?: string, search?: string|null, status?: string|null, severity?: string|null}  $filters
     * @return list<array<string, mixed>>
     */
    private function rows(array $section, array $filters): array
    {
        return match ($section['kind']) {
            'case', 'queue' => $this->caseRows($section['value'], $section['kind'] === 'queue', $filters),
            'restriction' => $this->restrictionRows((string) $section['value'], $filters),
            'rule' => $this->ruleRows($filters),
            default => [],
        };
    }

    /**
     * @param  array{section?: string, search?: string|null, status?: string|null, severity?: string|null}  $filters
     * @return list<array<string, mixed>>
     */
    private function caseRows(?string $category, bool $queue, array $filters): array
    {
        $search = trim((string) ($filters['search'] ?? ''));

        return TrustSafetyCase::query()->select(['id', 'number', 'category', 'status', 'severity', 'risk_score', 'source', 'summary', 'assigned_to', 'detected_at', 'resolution_notes'])
            ->with('assignee:id,name')->when($category !== null, fn (Builder $query): Builder => $query->where('category', $category))
            ->when($queue, fn (Builder $query): Builder => $query->whereIn('status', ['open', 'in_review']))
            ->when(filled($filters['status'] ?? null), fn (Builder $query): Builder => $query->where('status', $filters['status']))
            ->when(filled($filters['severity'] ?? null), fn (Builder $query): Builder => $query->where('severity', $filters['severity']))
            ->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $nested): Builder => $nested->where('number', 'like', "%{$search}%")->orWhere('summary', 'like', "%{$search}%")))
            ->latest('detected_at')->limit(50)->get()->map(fn (TrustSafetyCase $case): array => [
                'id' => $case->id, 'type' => 'case', 'reference' => $case->number, 'title' => $case->summary,
                'category' => $case->category, 'status' => $case->status, 'severity' => $case->severity, 'score' => $case->risk_score,
                'source' => $case->source, 'owner' => $case->assignee?->name, 'occurred_at' => $case->detected_at?->toIso8601String(),
                'resolution_notes' => $case->resolution_notes,
            ])->values()->all();
    }

    /**
     * @param  array{section?: string, search?: string|null, status?: string|null, severity?: string|null}  $filters
     * @return list<array<string, mixed>>
     */
    private function restrictionRows(string $type, array $filters): array
    {
        $search = trim((string) ($filters['search'] ?? ''));

        return RiskRestriction::query()->select(['id', 'type', 'identifier', 'reason', 'active', 'created_by', 'expires_at', 'created_at'])
            ->with('creator:id,name')->where('type', $type)->when($search !== '', fn (Builder $query): Builder => $query->where(fn (Builder $nested): Builder => $nested->where('identifier', 'like', "%{$search}%")->orWhere('reason', 'like', "%{$search}%")))
            ->latest()->limit(50)->get()->map(fn (RiskRestriction $restriction): array => [
                'id' => $restriction->id, 'type' => 'restriction', 'reference' => str($restriction->type)->upper()->append('-'.$restriction->id)->toString(),
                'title' => $restriction->identifier, 'category' => $restriction->type, 'status' => $restriction->active ? 'active' : 'released',
                'severity' => 'high', 'score' => null, 'source' => $restriction->reason, 'owner' => $restriction->creator?->name,
                'occurred_at' => $restriction->created_at?->toIso8601String(), 'expires_at' => $restriction->expires_at?->toIso8601String(),
            ])->values()->all();
    }

    /**
     * @param  array{section?: string, search?: string|null, status?: string|null, severity?: string|null}  $filters
     * @return list<array<string, mixed>>
     */
    private function ruleRows(array $filters): array
    {
        $search = trim((string) ($filters['search'] ?? ''));

        return RiskRule::query()->select(['id', 'name', 'category', 'action', 'risk_score', 'enabled', 'matches_count', 'last_matched_at', 'created_at'])
            ->when($search !== '', fn (Builder $query): Builder => $query->where('name', 'like', "%{$search}%"))->latest()->limit(50)->get()
            ->map(fn (RiskRule $rule): array => [
                'id' => $rule->id, 'type' => 'rule', 'reference' => 'RULE-'.$rule->id, 'title' => $rule->name,
                'category' => $rule->category, 'status' => $rule->enabled ? 'active' : 'disabled', 'severity' => $rule->risk_score >= 80 ? 'critical' : ($rule->risk_score >= 50 ? 'high' : 'medium'),
                'score' => $rule->risk_score, 'source' => str($rule->action)->replace('_', ' ')->title()->toString(), 'owner' => null,
                'matches' => $rule->matches_count, 'occurred_at' => ($rule->last_matched_at ?? $rule->created_at)?->toIso8601String(),
            ])->values()->all();
    }
}
