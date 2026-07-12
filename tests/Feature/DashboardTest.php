<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get('/admin/dashboard');

        $response->assertRedirect('/login');
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => true,
        ]);

        $response = $this
            ->actingAs($admin)
            ->get('/admin/dashboard');

        $response
            ->assertOk()
            ->assertViewIs('admin.dashboard')
            ->assertSee('Dashboard Overview');
    }

    public function test_customer_cannot_access_admin_dashboard(): void
    {
        $customer = User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => true,
        ]);

        $response = $this
            ->actingAs($customer)
            ->get('/admin/dashboard');

        $response->assertForbidden();
    }

    public function test_inactive_admin_cannot_access_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => false,
        ]);

        $response = $this
            ->actingAs($admin)
            ->get('/admin/dashboard');

        $response->assertRedirect('/login');

        $this->assertGuest();
    }
}
