@extends('admin.layouts.app')

@section('title', 'Edit Brand')
@section('page-title', 'Edit Brand')
@section('breadcrumb', 'Brands / Edit')

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
