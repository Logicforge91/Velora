<?php

namespace App\Services\Admin;

use App\Models\NotificationDelivery;
use App\Models\NotificationRule;
use App\Models\NotificationTemplate;
use App\Models\User;
use Illuminate\Support\Str;

class NotificationManagementService
{
    /** @return array<string, int> */
    public function counts(): array
    {
        $templates = NotificationTemplate::query()
            ->selectRaw('COUNT(*) total')
            ->selectRaw("SUM(CASE WHEN channel = 'mail' THEN 1 ELSE 0 END) mail")
            ->selectRaw("SUM(CASE WHEN channel = 'sms' THEN 1 ELSE 0 END) sms")
            ->selectRaw("SUM(CASE WHEN channel = 'push' THEN 1 ELSE 0 END) push")
            ->selectRaw("SUM(CASE WHEN channel = 'whatsapp' THEN 1 ELSE 0 END) whatsapp")
            ->toBase()
            ->firstOrFail();
        $deliveries = NotificationDelivery::query()
            ->selectRaw('COUNT(*) history')
            ->selectRaw("SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) failed")
            ->toBase()
            ->firstOrFail();

        return [
            'admin' => NotificationRule::query()->where('audience', 'admin')->count(),
            'seller' => NotificationRule::query()->where('audience', 'seller')->count(),
            'customer' => NotificationRule::query()->where('audience', 'customer')->count(),
            'email_templates' => (int) $templates->mail,
            'sms_templates' => (int) $templates->sms,
            'push_templates' => (int) $templates->push,
            'whatsapp_templates' => (int) $templates->whatsapp,
            'rules' => NotificationRule::query()->count(),
            'history' => (int) $deliveries->history,
            'failed' => (int) $deliveries->failed,
        ];
    }

    /** @return array<int, NotificationTemplate> */
    public function templates(): array
    {
        return NotificationTemplate::query()->latest('updated_at')->get()->all();
    }

    /** @return array<int, NotificationRule> */
    public function rules(): array
    {
        return NotificationRule::query()->latest('updated_at')->get()->all();
    }

    /** @return array<int, NotificationDelivery> */
    public function deliveries(bool $failedOnly = false): array
    {
        return NotificationDelivery::query()
            ->with(['template:id,name,channel', 'rule:id,name,event'])
            ->when($failedOnly, fn ($query) => $query->where('status', 'failed'))
            ->latest()
            ->limit(100)
            ->get()
            ->all();
    }

    /** @param array<string, mixed> $data */
    public function saveTemplate(array $data, User $actor): NotificationTemplate
    {
        $slug = Str::slug((string) ($data['slug'] ?: $data['name']));

        return NotificationTemplate::query()->updateOrCreate(
            ['slug' => $slug],
            [...$data, 'slug' => $slug, 'updated_by' => $actor->id],
        );
    }

    /** @param array<string, mixed> $data */
    public function saveRule(array $data, User $actor): NotificationRule
    {
        return NotificationRule::query()->updateOrCreate(
            ['event' => $data['event'], 'audience' => $data['audience']],
            [...$data, 'updated_by' => $actor->id],
        );
    }
}
