<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt Preview - <?php echo e($appointment->id); ?></title>
    <style>
        body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            font-family: 'DejaVu Sans', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .preview-container {
            background: #fff;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            width: 420px;
            transform: scale(1.15);
            transform-origin: top center;
            line-height: 1.4;
        }

        .header {   
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }

        .clinic-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 2px;
        }

        .clinic-tagline {
            font-size: 12px;
            color: #666;
        }

        .receipt-title {
            font-size: 14px;
            font-weight: bold;
            margin: 6px 0;
        }

        .receipt-info {
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 12px;
        }

        .section {
            margin-bottom: 10px;
        }

        .section-title {
            font-size: 12px;
            font-weight: bold;
            background-color: #f0f0f0;
            padding: 5px 8px;
            margin-bottom: 5px;
            border-radius: 3px;
        }

        .info-grid {
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            font-size: 11px;
        }

        .service-details {
            background-color: #f8f8f8;
            padding: 8px;
            margin: 6px 0;
            border-radius: 4px;
            font-size: 11px;
        }

        .price-table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
            font-size: 11px;
        }

        .price-table td {
            padding: 4px 0;
        }

        .price-table .total {
            font-weight: bold;
            border-top: 1px solid #000;
            font-size: 12px;
            padding-top: 6px;
        }

        .footer {
            text-align: center;
            margin-top: 15px;
            padding-top: 8px;
            border-top: 1px solid #ccc;
            font-size: 10px;
            color: #666;
        }

        .status-badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }

        .status-completed { background-color: #d4edda; color: #155724; }
        .status-confirmed { background-color: #d1ecf1; color: #0c5460; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .payment-paid { background-color: #d4edda; color: #155724; }
        .payment-unpaid { background-color: #fff3cd; color: #856404; }

        .text-right { text-align: right; }
        .mb-1 { margin-bottom: 3px; }
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
            <div><strong>Receipt #<?php echo e($receipt_number); ?></strong></div>
            <div>Issued: <?php echo e($issued_date); ?></div>
        </div>

        <div class="section">
            <div class="section-title">APPOINTMENT INFORMATION</div>
            <div class="info-grid">
                <div>Appointment ID:</div>
                <div>#<?php echo e($appointment->id); ?></div>
                
                <div>Date & Time:</div>
                <div><?php echo e(\Carbon\Carbon::parse($appointment->appointment_date)->format('F j, Y g:i A')); ?></div>
                
                <div>Status:</div>
                <div>
                    <span class="status-badge status-<?php echo e($appointment->status); ?>">
                        <?php echo e(ucfirst($appointment->status)); ?>

                    </span>
                </div>
                
                <div>Payment Status:</div>
                <div>
                    <span class="status-badge payment-<?php echo e($appointment->payment_status); ?>">
                        <?php echo e(ucfirst($appointment->payment_status)); ?>

                    </span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">CLIENT INFORMATION</div>
            <div class="info-grid">
                <div>Client Name:</div>
                <div><?php echo e($appointment->user->first_name); ?> <?php echo e($appointment->user->last_name); ?></div>
                
                <div>Email:</div>
                <div><?php echo e($appointment->user->email); ?></div>
                
                <div>Pet Name:</div>
                <div><?php echo e($appointment->pet->name); ?></div>
                
                <div>Pet ID:</div>
                <div>#<?php echo e($appointment->pet->id); ?></div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">SERVICE DETAILS</div>
            <div class="service-details">
                <div class="mb-1"><strong><?php echo e($appointment->service->name); ?></strong></div>
                <?php if($appointment->service->description): ?>
                <div><?php echo e($appointment->service->description); ?></div>
                <?php endif; ?>
            </div>

            <table class="price-table">
                <tr>
                    <td>Service Fee:</td>
                    <td class="text-right">₱<?php echo e(number_format($appointment->service->price, 2)); ?></td>
                </tr>
                <tr>
                    <td>Tax:</td>
                    <td class="text-right">₱0.00</td>
                </tr>
                <tr class="total">
                    <td>TOTAL AMOUNT:</td>
                    <td class="text-right">₱<?php echo e(number_format($appointment->service->price, 2)); ?></td>
                </tr>
            </table>
        </div>

        <?php if($appointment->notes): ?>
        <div class="section">
            <div class="section-title">CUSTOMER NOTES</div>
            <div style="font-size: 11px; line-height: 1.4;"><?php echo e($appointment->notes); ?></div>
        </div>
        <?php endif; ?>

        <div class="footer">
            <div>Thank you for choosing FureverHealth Clinic!</div>
            <div>For inquiries: pet@FureverHealth.com | 0999932323</div>
            <div>This is a computer-generated receipt. No signature required.</div>
        </div>
    </div>
</body>
</html>
<?php /**PATH C:\xampp\htdocs\Capstone-FureverHealth\resources\views/receipts/preview.blade.php ENDPATH**/ ?>