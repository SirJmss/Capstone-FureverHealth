<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_id',
        'schedule_date',
        'start_time',
        'end_time',
        'status',
        'remarks',
    ];

    // Relationship: Schedule belongs to a Staff
    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
