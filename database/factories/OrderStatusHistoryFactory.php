<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<OrderStatusHistory> */
class OrderStatusHistoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'from_status' => 'pending',
            'to_status' => 'processing',
            'payment_status' => 'paid',
            'customer_visible' => true,
            'occurred_at' => now(),
        ];
    }
}
