<?php

namespace Tests\Feature\Admin;

use Tests\TestCase;

class SettlementOperationsTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
