<?php

namespace App\Models;

use App\Models\Pet;
use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'pet_id',
        'staff_id',
        'appointment_date',
        'service_type',
        'status',
        'remarks',
    ];

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
