<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the storefront home page is available', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('welcome')
            ->where('auth.user', null));
});
