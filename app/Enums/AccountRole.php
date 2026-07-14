<?php

namespace App\Enums;

enum AccountRole: string
{
    case Admin = 'admin';
    case Vendor = 'vendor';
    case Customer = 'customer';
    case DeliveryAgent = 'delivery_agent';
    case SupportAgent = 'support_agent';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Vendor => 'Vendor',
            self::Customer => 'Customer',
            self::DeliveryAgent => 'Delivery agent',
            self::SupportAgent => 'Support agent',
        };
    }

    /** @return list<AccountPermission> */
    public function permissions(): array
    {
        return match ($this) {
            self::Admin => [],
            self::Vendor => [
                AccountPermission::AccessVendorDashboard,
                AccountPermission::ManageOwnCatalogue,
                AccountPermission::ManageOwnOrders,
                AccountPermission::ManageOwnProfile,
            ],
            self::Customer => [
                AccountPermission::Shop,
                AccountPermission::ManageOwnOrders,
                AccountPermission::ManageOwnProfile,
            ],
            self::DeliveryAgent => [
                AccountPermission::AccessDeliveryDashboard,
                AccountPermission::ManageAssignedDeliveries,
                AccountPermission::ManageOwnProfile,
            ],
            self::SupportAgent => [
                AccountPermission::AccessSupportDashboard,
                AccountPermission::HandleSupportRequests,
                AccountPermission::ManageOwnProfile,
            ],
        };
    }

    public function hasPermission(AccountPermission $permission): bool
    {
        return in_array($permission, $this->permissions(), true);
    }
}
