import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Payment } from '../../../models/payment';
import { PaymentService } from '../../../services/payment';
import { PaymentForm } from './components/payment-form/payment-form';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    PaymentForm
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payments implements OnInit {

  private readonly paymentService = inject(PaymentService);
  private readonly toastr = inject(ToastrService);

  isLoading = signal(true);
  payments = signal<Payment[]>([]);
  search = signal('');
  isDetailsOpen = signal(false);
  selectedPayment = signal<Payment | null>(null);

  filteredPayments = computed(() => {
    const keyword = this.search().trim().toLowerCase();

    return this.payments().filter(payment =>
      payment.member.fullname.toLowerCase().includes(keyword) ||
      payment.member.email.toLowerCase().includes(keyword) ||
      payment.type.toLowerCase().includes(keyword) ||
      payment.status.toLowerCase().includes(keyword)
    );
  });

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading.set(true);

    this.paymentService.getAllPayments().subscribe({
      next: (response) => {
        this.payments.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(
          err.error?.message || 'Failed to load payments.',
          'Error'
        );
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
  }

  openDetails(payment: Payment): void {
    this.selectedPayment.set(payment);
    this.isDetailsOpen.set(true);
  }

  closeDetails(): void {
    this.selectedPayment.set(null);
    this.isDetailsOpen.set(false);
  }

}