<?php

namespace App\Enums;

enum AccountPermission: string
{
    case AccessAdminDashboard = 'admin.dashboard.view';
    case ManageUsers = 'users.manage';
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
}
