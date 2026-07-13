<?php

namespace App\Models;

use Database\Factories\CatalogImportFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogImport extends Model
{
    /** @use HasFactory<CatalogImportFactory> */
    use HasFactory;

    protected $fillable = ['uuid', 'uploaded_by', 'original_name', 'file_path', 'status', 'dry_run', 'total_rows', 'processed_rows', 'created_rows', 'updated_rows', 'failed_rows', 'errors', 'started_at', 'completed_at'];

    protected $hidden = ['file_path'];

    protected $attributes = ['status' => 'queued', 'dry_run' => false, 'total_rows' => 0, 'processed_rows' => 0, 'created_rows' => 0, 'updated_rows' => 0, 'failed_rows' => 0];

    protected function casts(): array
    {
        return ['dry_run' => 'boolean', 'errors' => 'array', 'started_at' => 'datetime', 'completed_at' => 'datetime'];
    }

    /** @return BelongsTo<User, $this> */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by')->withTrashed();
    }
}
