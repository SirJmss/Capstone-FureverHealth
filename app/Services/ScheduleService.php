<?php

namespace App\Services;

use App\Models\Schedule;
use App\Models\TimeSlot;
use Illuminate\Support\Facades\DB;

class ScheduleService
{
    /**
     * Check if a time slot is available for booking
     */
    public function isTimeSlotAvailable(int $timeId, string $date, ?int $excludeAppointmentId = null): bool
    {
        $timeSlot = TimeSlot::findOrFail($timeId);
        
        // Count currently scheduled appointments for this time slot and date
        $bookedCount = Schedule::scheduled()
            ->forTimeSlot($timeId)
            ->forDate($date)
            ->when($excludeAppointmentId, function($query) use ($excludeAppointmentId) {
                $query->where('appointment_id', '!=', $excludeAppointmentId);
            })
            ->count();
        
        return $bookedCount < $timeSlot->max_appointments;
    }

    /**
     * Get available time slots for a specific date
     */
    public function getAvailableTimeSlots(string $date): array
    {
        $timeSlots = TimeSlot::active()->get();
        $availableSlots = [];

        foreach ($timeSlots as $timeSlot) {
            if ($this->isTimeSlotAvailable($timeSlot->id, $date)) {
                $availableSlots[] = [
                    'id' => $timeSlot->id,
                    'time_range' => $timeSlot->time_range,
                    'available_slots' => $timeSlot->max_appointments - 
                        Schedule::scheduled()
                            ->forTimeSlot($timeSlot->id)
                            ->forDate($date)
                            ->count(),
                    'max_appointments' => $timeSlot->max_appointments,
                ];
            }
        }

        return $availableSlots;
    }

    /**
     * Create a new schedule for an appointment
     */
    public function createSchedule(array $data): Schedule
    {
        // Use transaction to ensure data consistency
        return DB::transaction(function () use ($data) {
            // Validate availability before creating
            if (!$this->isTimeSlotAvailable($data['time_id'], $data['date'])) {
                throw new \Exception('Selected time slot is no longer available.');
            }

            return Schedule::create($data);
        });
    }

    /**
     * Reschedule an appointment to a new time/date
     */
    public function reschedule(int $scheduleId, array $newData): Schedule
    {
        return DB::transaction(function () use ($scheduleId, $newData) {
            $oldSchedule = Schedule::findOrFail($scheduleId);
            
            // Mark old schedule as rescheduled
            $oldSchedule->update([
                'status' => 'rescheduled',
                'notes' => $newData['reschedule_notes'] ?? 'Rescheduled to new time'
            ]);

            // Check if new time slot is available
            if (!$this->isTimeSlotAvailable($newData['time_id'], $newData['date'], $oldSchedule->appointment_id)) {
                throw new \Exception('New time slot is not available.');
            }

            // Create new schedule
            return Schedule::create([
                'appointment_id' => $oldSchedule->appointment_id,
                'time_id' => $newData['time_id'],
                'date' => $newData['date'],
                'status' => 'scheduled',
                'notes' => $newData['notes'] ?? null,
            ]);
        });
    }

    /**
     * Cancel a schedule
     */
    public function cancel(int $scheduleId, string $cancellationNotes = null): Schedule
    {
        $schedule = Schedule::findOrFail($scheduleId);
        
        $schedule->update([
            'status' => 'cancelled',
            'notes' => $cancellationNotes ?: $schedule->notes
        ]);

        return $schedule;
    }
}