<?php

namespace App\Services\Admin;

use App\Models\Integration;
use App\Models\IntegrationLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * @phpstan-type IntegrationField array{label: string, type: string, secret: bool, placeholder?: string}
 * @phpstan-type IntegrationDefinition array{label: string, description: string, providers: array<string, string>, fields: array<string, IntegrationField>}
 */
class IntegrationManagementService
{
    /** @return array<string, IntegrationDefinition> */
    public function definitions(): array
    {
        return [
            'payment_gateways' => $this->definition('Payment Gateways', 'Accept and reconcile online marketplace payments.', ['razorpay' => 'Razorpay', 'stripe' => 'Stripe', 'paypal' => 'PayPal'], [
                'merchant_id' => $this->field('Merchant / account ID'),
                'api_key' => $this->field('API key', true),
                'api_secret' => $this->field('API secret', true),
                'webhook_secret' => $this->field('Webhook secret', true),
            ]),
            'shipping_partners' => $this->definition('Shipping Partners', 'Connect fulfilment, labels, tracking and delivery events.', ['shiprocket' => 'Shiprocket', 'delhivery' => 'Delhivery', 'custom' => 'Custom carrier'], [
                'account_id' => $this->field('Account ID'),
                'endpoint_url' => $this->field('API endpoint', false, 'https://api.example.com'),
                'api_token' => $this->field('API token', true),
            ]),
            'sms_providers' => $this->definition('SMS Providers', 'Send transactional OTP and order notifications.', ['msg91' => 'MSG91', 'twilio' => 'Twilio', 'textlocal' => 'Textlocal'], [
                'sender_id' => $this->field('Sender ID'),
                'template_namespace' => $this->field('Template namespace'),
                'api_key' => $this->field('API key', true),
            ]),
            'email_providers' => $this->definition('Email Providers', 'Deliver transactional and lifecycle email.', ['smtp' => 'SMTP', 'mailgun' => 'Mailgun', 'postmark' => 'Postmark', 'ses' => 'Amazon SES'], [
                'from_email' => $this->field('From email'),
                'domain' => $this->field('Domain / host'),
                'username' => $this->field('Username', true),
                'api_key' => $this->field('Password / API key', true),
            ]),
            'whatsapp' => $this->definition('WhatsApp Integration', 'Send approved WhatsApp commerce templates.', ['meta' => 'Meta Cloud API', 'twilio' => 'Twilio WhatsApp'], [
                'business_account_id' => $this->field('Business account ID'),
                'phone_number_id' => $this->field('Phone number ID'),
                'access_token' => $this->field('Access token', true),
            ]),
            'gst' => $this->definition('GST Integration', 'Synchronize tax invoices and GST compliance.', ['cleartax' => 'ClearTax', 'masters_india' => 'Masters India', 'manual' => 'Manual'], [
                'gstin' => $this->field('GSTIN'),
                'environment' => $this->field('Environment', false, 'sandbox'),
                'api_key' => $this->field('API key', true),
            ]),
            'erp' => $this->definition('ERP Integration', 'Exchange catalogue, inventory and accounting data.', ['sap' => 'SAP', 'tally' => 'Tally', 'odoo' => 'Odoo', 'custom' => 'Custom ERP'], [
                'base_url' => $this->field('Base URL'),
                'tenant' => $this->field('Tenant / company'),
                'api_token' => $this->field('API token', true),
            ]),
            'crm' => $this->definition('CRM Integration', 'Synchronize customers, leads and support activity.', ['salesforce' => 'Salesforce', 'hubspot' => 'HubSpot', 'zoho' => 'Zoho CRM'], [
                'base_url' => $this->field('Instance URL'),
                'client_id' => $this->field('Client ID'),
                'client_secret' => $this->field('Client secret', true),
            ]),
            'analytics' => $this->definition('Analytics Integration', 'Connect storefront and conversion analytics.', ['ga4' => 'Google Analytics 4', 'gtm' => 'Google Tag Manager', 'mixpanel' => 'Mixpanel'], [
                'measurement_id' => $this->field('Measurement / container ID'),
                'api_secret' => $this->field('API secret', true),
            ]),
            'social_login' => $this->definition('Social Login', 'Configure OAuth login through Laravel Socialite.', ['google' => 'Google', 'github' => 'GitHub', 'facebook' => 'Facebook'], [
                'client_id' => $this->field('OAuth client ID'),
                'client_secret' => $this->field('OAuth client secret', true),
                'redirect_url' => $this->field('Callback URL'),
            ]),
            'api_credentials' => $this->definition('API Credentials', 'Manage credentials for external API consumers.', ['first_party' => 'First-party client', 'partner' => 'Partner client', 'custom' => 'Custom client'], [
                'client_name' => $this->field('Client name'),
                'client_id' => $this->field('Client ID'),
                'client_secret' => $this->field('Client secret', true),
            ]),
            'webhooks' => $this->definition('Webhooks', 'Deliver signed marketplace events to partner endpoints.', ['outbound' => 'Outbound webhook'], [
                'endpoint_url' => $this->field('Endpoint URL'),
                'events' => $this->field('Subscribed events', false, 'orders.created, payments.completed'),
                'signing_secret' => $this->field('Signing secret', true),
            ]),
        ];
    }

    /** @return array<string, array<string, mixed>> */
    public function integrations(): array
    {
        $stored = Integration::query()->get()->keyBy('category');
        $integrations = [];

        foreach ($this->definitions() as $category => $definition) {
            $integration = $stored->get($category);
            $configuration = $integration instanceof Integration ? ($integration->configuration ?? []) : [];
            $credentials = $integration instanceof Integration ? ($integration->credentials ?? []) : [];

            $integrations[$category] = [
                'provider' => $integration instanceof Integration ? $integration->provider : array_key_first($definition['providers']),
                'enabled' => $integration instanceof Integration && $integration->enabled,
                'status' => $integration instanceof Integration ? $integration->status : 'disconnected',
                'configuration' => $configuration,
                'credentials_configured' => collect($credentials)->map(fn (mixed $value): bool => filled($value))->all(),
                'updated_at' => $integration instanceof Integration ? $integration->updated_at?->toISOString() : null,
            ];
        }

        return $integrations;
    }

    /** @return array<int, IntegrationLog> */
    public function logs(): array
    {
        return IntegrationLog::query()
            ->with(['actor:id,name', 'integration:id,category,provider'])
            ->latest('occurred_at')
            ->limit(50)
            ->get()
            ->all();
    }

    /**
     * @param  array{provider: string, enabled: bool, configuration: array<string, mixed>, credentials: array<string, mixed>}  $data
     */
    public function update(string $category, array $data, User $actor): Integration
    {
        $definition = $this->definitions()[$category] ?? null;

        if ($definition === null) {
            throw ValidationException::withMessages(['category' => 'The selected integration category is invalid.']);
        }

        return DB::transaction(function () use ($category, $data, $actor, $definition): Integration {
            $integration = Integration::query()->firstOrNew(['category' => $category]);
            $existingCredentials = $integration->exists ? ($integration->credentials ?? []) : [];
            $publicKeys = collect($definition['fields'])->reject(fn (array $field): bool => $field['secret'])->keys()->all();
            $secretKeys = collect($definition['fields'])->filter(fn (array $field): bool => $field['secret'])->keys()->all();
            $newCredentials = collect($data['credentials'])->only($secretKeys)->filter(fn (mixed $value): bool => filled($value))->all();

            $integration->fill([
                'provider' => $data['provider'],
                'enabled' => $data['enabled'],
                'configuration' => collect($data['configuration'])->only($publicKeys)->all(),
                'credentials' => [...$existingCredentials, ...$newCredentials],
                'status' => $data['enabled'] ? 'configured' : 'disabled',
                'last_configured_at' => now(),
                'updated_by' => $actor->id,
            ])->save();

            $integration->logs()->create([
                'category' => $category,
                'action' => 'configuration_updated',
                'status' => 'success',
                'message' => "{$definition['label']} configuration updated.",
                'context' => ['provider' => $data['provider'], 'enabled' => $data['enabled']],
                'actor_id' => $actor->id,
                'occurred_at' => now(),
            ]);

            return $integration->fresh();
        });
    }

    /**
     * @param  array<string, string>  $providers
     * @param  array<string, IntegrationField>  $fields
     * @return IntegrationDefinition
     */
    private function definition(string $label, string $description, array $providers, array $fields): array
    {
        return compact('label', 'description', 'providers', 'fields');
    }

    /** @return IntegrationField */
    private function field(string $label, bool $secret = false, ?string $placeholder = null): array
    {
        $field = ['label' => $label, 'type' => $secret ? 'password' : 'text', 'secret' => $secret];

        if ($placeholder !== null) {
            $field['placeholder'] = $placeholder;
        }

        return $field;
    }
}
