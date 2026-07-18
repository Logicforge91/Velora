<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\PaymentRefund;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<PaymentRefund> */
class PaymentRefundFactory extends Factory
{
    public function definition(): array
    {
        return [
            'payment_id' => fn (): int => Order::factory()->create()->payment()->value('id'),
            'number' => 'RFN-'.Str::upper(Str::random(12)),
            'amount' => 500,
            'reason_code' => 'customer_return',
            'status' => 'requested',
            'requested_at' => now(),
        ];
    }
}
