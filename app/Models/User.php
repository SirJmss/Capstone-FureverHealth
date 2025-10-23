<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'user_type', 
        'address',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /** 
     * 🐾 Relationship: A user (pet owner) can have many pets 
     */
    public function pets()
    {
        return $this->hasMany(Pet::class);
    }

    /** 
     * 📅 Relationship: A user can have many appointments 
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * 🧑‍💼 Relationship: If the user is a staff or vet
     */
    public function staffProfile()
    {
        return $this->hasOne(Staff::class, 'user_id');
    }
}
