<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pet extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',          // Owner of the pet
        'name',
        'species',          // e.g., Dog, Cat, Rabbit
        'breed',
        'gender',           // male / female
        'age',              // in years
        'weight',           // in kilograms
        'medical_history',  // health background
        'allergies',        // allergy info
        'vaccinated',       // boolean
        'grooming_notes',   // optional notes
        'last_groomed_at',  // date
    ];


    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}

