<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isCustomer();
    }

    public function view(User $user, Order $order): bool
    {
        return $order->user_id === $user->id;
    }

    public function update(User $user, Order $order): bool
    {
        return $order->user_id === $user->id;
    }

    public function delete(User $user, Order $order): bool
    {
        return $order->user_id === $user->id
            && in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PROCESSING], true);
    }
}
