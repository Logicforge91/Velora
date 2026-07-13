<?php

namespace App\Enums;

enum AccountPermission: string
{
    case AccessAdminDashboard = 'admin.dashboard.view';
    case ManageUsers = 'users.manage';
    case ManageRoles = 'roles.manage';
    case ManageVendors = 'vendors.manage';
    case ManageCatalogue = 'catalogue.manage';
    case ManageOrders = 'orders.manage';
    case ManagePayments = 'payments.manage';
    case ViewReports = 'reports.view';

    case AccessVendorDashboard = 'vendor.dashboard.view';
    case ManageOwnCatalogue = 'catalogue.own.manage';
    case ManageOwnOrders = 'orders.own.manage';

    case Shop = 'shop.access';
    case ManageOwnProfile = 'profile.own.manage';

    case AccessDeliveryDashboard = 'delivery.dashboard.view';
    case ManageAssignedDeliveries = 'deliveries.assigned.manage';

    case AccessSupportDashboard = 'support.dashboard.view';
    case HandleSupportRequests = 'support.requests.manage';

    public function label(): string
    {
        return match ($this) {
            self::AccessAdminDashboard => 'Access admin dashboard',
            self::ManageUsers => 'Manage users',
            self::ManageRoles => 'Manage admin roles',
            self::ManageVendors => 'Manage vendors and KYC',
            self::ManageCatalogue => 'Manage catalogue and inventory',
            self::ManageOrders => 'Manage orders and fulfilment',
            self::ManagePayments => 'Manage payments and settlements',
            self::ViewReports => 'View analytics and audit reports',
            self::HandleSupportRequests => 'Handle support requests',
            default => str($this->value)->replace(['.', '_'], ' ')->headline()->toString(),
        };
    }

    /** @return list<self> */
    public static function assignableToAdmin(): array
    {
        return [
            self::AccessAdminDashboard,
            self::ManageUsers,
            self::ManageRoles,
            self::ManageVendors,
            self::ManageCatalogue,
            self::ManageOrders,
            self::ManagePayments,
            self::ViewReports,
            self::HandleSupportRequests,
        ];
    }
}
