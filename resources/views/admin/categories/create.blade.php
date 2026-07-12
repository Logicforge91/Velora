@extends('admin.layouts.app')

@section('title', 'Create Category')
@section('page-title', 'Create Category')

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
