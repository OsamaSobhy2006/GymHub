import { Component, inject, signal } from '@angular/core';
import { MemebershipPlansService } from '../../services/memebership-plans';
import { MemebershipPlans } from '../../models/memebersip-plans';
import { PaymentService } from '../../services/payment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  imports: [],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans {
  membershipPlansService = inject(MemebershipPlansService)
  plans = signal<MemebershipPlans[]>([])
  isLoading = signal(true)
  private readonly paymentService = inject(PaymentService);
  private readonly toastr = inject(ToastrService);
  checkoutLoading = signal<string | null>(null);


  ngOnInit(): void {
    this.loadPlans()
  }

  loadPlans(): void{
    this.membershipPlansService.getAllPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans.data)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.log(err)
        this.isLoading.set(false)
      }
    })
  }

  subscribeToPlan(planId: string): void {
  this.checkoutLoading.set(planId);
  this.paymentService.createMembershipCheckout(planId).subscribe({
    next: (response) => {
      window.location.assign(response.checkoutUrl);
    },
    error: (error) => {
      this.checkoutLoading.set(null);

      switch (error.status) {
        case 401:
          this.toastr.warning(
            'Please login first.',
            'Authentication Required'
          );
          break;

        case 403:
          this.toastr.warning(
            'Only members can purchase memberships.',
            'Access Denied'
          );
          break;

        case 400:
          this.toastr.info(
            'You already have an active membership.',
            'Membership'
          );
          break;

        case 404:
          this.toastr.error(
            'Membership plan not found.',
            'Error'
          );
          break;

        default:
          this.toastr.error(
            'Unable to start the checkout process.',
            'Payment Error'
          );
      }
    },
  });
}
}
