<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'time_id',
        'date',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Relationship with Appointment
     */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Relationship with TimeSlot
     */
    public function timeSlot(): BelongsTo
    {
        return $this->belongsTo(TimeSlot::class, 'time_id');
    }

    /**
     * Scope for scheduled appointments
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope for specific date
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }

    /**
     * Scope for specific time slot
     */
    public function scopeForTimeSlot($query, $timeId)
    {
        return $query->where('time_id', $timeId);
    }

    /**
     * Check if schedule is active (not cancelled or completed)
     */
    public function isActive(): bool
    {
        return in_array($this->status, ['scheduled']);
    }

    /**
     * Get formatted appointment datetime
     */
    public function getAppointmentDateTimeAttribute(): string
    {
        return $this->date->format('Y-m-d') . ' ' . $this->timeSlot->start_time;
    }
}