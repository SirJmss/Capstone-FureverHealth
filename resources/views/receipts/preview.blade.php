<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt Preview - {{ $appointment->id }}</title>
     <style>
        body {
            width: 90mm; /* Slightly less than full width */
            height: 148mm;
            margin: 0 auto; 
            padding: 2mm;
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 9px;
            line-height: 1.2;
            color: #000;
        }
        .header {   
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
            margin-bottom: 6px;
        }
        .clinic-name {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 0px;
        }
        .clinic-tagline {
            font-size: 8px;
            color: #666;
        }
        .receipt-title {
            font-size: 10px;
            font-weight: bold;
            margin:2px 0;
        }
        .receipt-info {
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 8px;
        }
        .section {
            margin-bottom: 5px;
        }
        .section-title {
            font-size: 8px;
            font-weight: bold;
            background-color: #f0f0f0;
            padding: 3px 5px;
            margin-bottom: 3px;
            border-radius: 2px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3px;
            font-size: 7px;
        }
        .service-details {
            background-color: #f8f8f8;
            padding: 5px;
            margin: 4px 0;
            border-radius: 3px;
            font-size: 8px;
        }
        .price-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
            font-size: 8px;
        }
        .price-table td {
            padding: 3px 0;
        }
        .price-table .total {
            font-weight: bold;
            border-top: 1px solid #000;
            font-size: 8px;
            padding-top: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px solid #ccc;
            font-size: 7px;
            color: #666;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 7px;
            font-weight: bold;
        }
        .status-completed { background-color: #d4edda; color: #155724; }
        .status-confirmed { background-color: #d1ecf1; color: #0c5460; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .payment-paid { background-color: #d4edda; color: #155724; }
        .payment-unpaid { background-color: #fff3cd; color: #856404; }
        .text-right { text-align: right; }
        .mb-1 { margin-bottom: 2px; }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="header">
            <div class="clinic-name">FureverHealth Clinic</div>
            <div class="clinic-tagline">Furever healthy, Furever happy</div>
            <div class="receipt-title">APPOINTMENT RECEIPT</div>
        </div>

        <div class="receipt-info">
            <div><strong>Receipt #{{ $receipt_number }}</strong></div>
            <div>Issued: {{ $issued_date }}</div>
        </div>

        <div class="section">
            <div class="section-title">APPOINTMENT INFORMATION</div>
            <div class="info-grid">
                <div>Appointment ID:</div>
                <div>#{{ $appointment->id }}</div>
                
                <div>Date & Time:</div>
                <div>{{ \Carbon\Carbon::parse($appointment->appointment_date)->format('F j, Y g:i A') }}</div>
                
                <div>Status:</div>
                <div>
                    <span class="status-badge status-{{ $appointment->status }}">
                        {{ ucfirst($appointment->status) }}
                    </span>
                </div>
                
                <div>Payment Status:</div>
                <div>
                    <span class="status-badge payment-{{ $appointment->payment_status }}">
                        {{ ucfirst($appointment->payment_status) }}
                    </span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">CLIENT INFORMATION</div>
            <div class="info-grid">
                <div>Client Name:</div>
                <div>{{ $appointment->user->first_name }} {{ $appointment->user->last_name }}</div>
                
                <div>Email:</div>
                <div>{{ $appointment->user->email }}</div>
                
                <div>Pet Name:</div>
                <div>{{ $appointment->pet->name }}</div>
                
                <div>Pet ID:</div>
                <div>#{{ $appointment->pet->id }}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">SERVICE DETAILS</div>
            <div class="service-details">
                <div class="mb-1"><strong>{{ $appointment->service->name }}</strong></div>
                @if($appointment->service->description)
                <div>{{ $appointment->service->description }}</div>
                @endif
            </div>

            <table class="price-table">
                <tr>
                    <td>Service Fee:</td>
                    <td class="text-right">₱{{ number_format($appointment->service->price, 2) }}</td>
                </tr>
                <tr>
                    <td>Tax:</td>
                    <td class="text-right">₱0.00</td>
                </tr>
                <tr class="total">
                    <td>TOTAL AMOUNT:</td>
                    <td class="text-right">₱{{ number_format($appointment->service->price, 2) }}</td>
                </tr>
            </table>
        </div>

        @if($appointment->notes)
        <div class="section">
            <div class="section-title">CUSTOMER NOTES</div>
            <div style="font-size: 11px; line-height: 1.4;">{{ $appointment->notes }}</div>
        </div>
        @endif

        <div class="footer">
            <div>Thank you for choosing FureverHealth Clinic!</div>
            <div>For inquiries: pet@FureverHealth.com | 0999932323</div>
            <div>This is a computer-generated receipt. No signature required.</div>
        </div>
    </div>
</body>
</html>
