import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Payment } from '../../../../../models/payment';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css'
})
export class PaymentForm {

  @Input({ required: true }) payment!: Payment;

  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

}