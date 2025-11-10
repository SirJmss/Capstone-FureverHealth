<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'price',
        'duration',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Add this relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Optional: If you have appointments
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}