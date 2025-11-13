<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TimeSlot;
use Carbon\Carbon;

class TimeSlotSeeder extends Seeder
{
    public function run()
    {
        $timeSlots = [
            ['09:00:00', '10:00:00', 'Morning Slot 1'],
            ['10:00:00', '11:00:00', 'Morning Slot 2'],
            ['11:00:00', '12:00:00', 'Morning Slot 3'],
            ['13:00:00', '14:00:00', 'Afternoon Slot 1'],
            ['14:00:00', '15:00:00', 'Afternoon Slot 2'],
            ['15:00:00', '16:00:00', 'Afternoon Slot 3'],
            ['16:00:00', '17:00:00', 'Afternoon Slot 4'],
        ];

        foreach ($timeSlots as $slot) {
            TimeSlot::create([
                'start_time' => $slot[0],
                'end_time' => $slot[1],
                'max_appointments' => 3,
                'is_active' => true,
                'description' => $slot[2],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}