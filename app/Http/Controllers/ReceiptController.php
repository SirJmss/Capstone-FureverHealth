<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    public function generateReceipt($appointmentId)
    {
        try {
            $appointment = Appointment::with(['user', 'pet', 'service', 'schedule.timeslot'])
                ->findOrFail($appointmentId);

            // Authorization check
            $user = auth()->user();
            if (!$user->hasRole(['Admin', 'Staff']) && $appointment->user_id !== $user->id) {
                abort(403, 'Unauthorized action.');
            }

            $data = [
                'appointment' => $appointment,
                'receipt_number' => 'RCPT-' . str_pad($appointment->id, 6, '0', STR_PAD_LEFT),
                'issued_date' => now()->format('M j, Y'),
                'issued_time' => now()->format('g:i A'),
            ];

            // Configure PDF for A6 with no margins
            $pdf = Pdf::loadView('receipts.appointment', $data)
                ->setPaper('a6', 'portrait')
                ->setOption('defaultFont', 'DejaVu Sans')
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isRemoteEnabled', true)
                ->setOption('dpi', 72)
                ->setOption('margin-top', 0)
                ->setOption('margin-right', 0)
                ->setOption('margin-bottom', 0)
                ->setOption('margin-left', 0);

            return $pdf->download("receipt-{$appointment->id}.pdf");

        } catch (\Exception $e) {
            \Log::error('PDF Generation Error: ' . $e->getMessage());
            return back()->with('error', 'Failed to generate receipt: ' . $e->getMessage());
        }
    }

    public function viewReceipt($appointmentId)
    {
        $appointment = Appointment::with(['user', 'pet', 'service', 'schedule.timeslot'])
            ->findOrFail($appointmentId);

        // Authorization check
        $user = auth()->user();
        if (!$user->hasRole(['Admin', 'Staff']) && $appointment->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $data = [
            'appointment' => $appointment,
            'receipt_number' => 'RCPT-' . str_pad($appointment->id, 6, '0', STR_PAD_LEFT),
            'issued_date' => now()->format('F j, Y'),
            'issued_time' => now()->format('g:i A'),
        ];

        return view('receipts.appointment', $data);
    }
}