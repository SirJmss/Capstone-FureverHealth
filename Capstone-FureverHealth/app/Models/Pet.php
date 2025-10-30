<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',         // Owner of the pet
        'name',
        'species',         // e.g., Dog, Cat
        'breed',
        'gender',
        'age',
        'weight',
        'color',
        'medical_history', // optional: vaccinations, allergies, etc.
        'photo',           // optional: pet image path
    ];

    /**
     * 🧍 Relationship: A pet belongs to a user (the owner)
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * 📅 Relationship: A pet can have many appointments
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
