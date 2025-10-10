<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointments extends Model
{
    use HasFactory;

    protected $fillable = [
        'pet_id',
        'owner_id',
        'staff_id',
        'schedule',
        'time',
        'service_type',
        'status',
    ];

    // Optional relationships
    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
