<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'pet_id',
        'service_id',
        'status',
        'notes',
        'staff_remarks',    
        'payment_status',
    ];

     // Add this relationship
    public function schedule()
    {
        return $this->hasOne(Schedule::class);
    }

    // Keep your existing relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}



