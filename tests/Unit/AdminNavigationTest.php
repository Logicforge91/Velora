<?php

test('admin navigation uses concise grouped menus', function () {
    $adminLayout = file_get_contents(dirname(__DIR__, 2).'/resources/js/layouts/admin-layout.tsx');

    expect($adminLayout)
        ->toContain("label: 'Dashboard'")
        ->toContain("label: 'Sellers'")
        ->toContain("label: 'Catalog'")
        ->toContain("label: 'Operations'")
        ->toContain("label: 'Finance'")
        ->toContain("label: 'Engagement'")
        ->toContain("label: 'Trust & Safety'")
        ->toContain("label: 'Analytics'")
        ->toContain("label: 'Settings'")
        ->toContain('groupedNavigationSections')
        ->toContain("items: selectNavigationItems(['Dashboard'], ['Overview'])")
        ->toContain("['Seller List', 'New Seller', 'Applications', 'KYC Review']")
        ->toContain("['Pricing', 'Payments']")
        ->toContain("'Customers',\n            'Marketing',\n            'Reviews',\n            'Support'")
        ->toContain('Filter admin navigation')
        ->toContain('isNavigationItemActive')
        ->toContain('section.items.length === 1');
});
