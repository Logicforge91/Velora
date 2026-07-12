@extends('admin.layouts.app')

@section('title', 'Edit Category')
@section('page-title', 'Edit Category')

@section('content')
    <div class="mb-5">
        <a
            href="{{ route('admin.categories.index') }}"
            class="text-sm font-semibold text-indigo-600
                   hover:text-indigo-800"
        >
            ← Back to categories
        </a>
    </div>

    @include('admin.categories._form')
@endsection
