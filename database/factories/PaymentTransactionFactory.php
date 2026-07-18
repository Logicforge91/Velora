<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\PaymentTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PaymentTransaction>
 */
class PaymentTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'payment_id' => fn (): int => (int) Order::factory()->create()->payment()->value('id'),
            'uuid' => (string) Str::uuid(),
            'provider_reference' => fake()->unique()->bothify('pay_############'),
            'type' => 'charge',
            'amount' => 1000,
            'currency' => 'INR',
            'status' => 'succeeded',
            'gateway' => 'razorpay',
            'processed_at' => now(),
        ];
    }
}
