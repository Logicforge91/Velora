@extends('admin.layouts.app')

@section('title', 'Create Brand')
@section('page-title', 'Create Brand')
@section('breadcrumb', 'Brands / Create')

@section('content')
    <div class="mb-5">
        <a
            href="{{ route('admin.brands.index') }}"
            class="text-sm font-semibold text-indigo-600
                   hover:text-indigo-700"
        >
            ← Back to brands
        </a>
    </div>

    @include('admin.brands._form')
@endsection
