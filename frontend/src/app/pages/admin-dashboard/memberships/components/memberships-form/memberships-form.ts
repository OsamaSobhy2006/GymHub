import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MembershipService } from '../../../../../services/membership';
import { UsersService } from '../../../../../services/users';
import { MemebershipPlansService } from '../../../../../services/memebership-plans';
import { Users } from '../../../../../models/users';
import { MemebershipPlans } from '../../../../../models/memebersip-plans';
import { CreateMembershipRequest } from '../../../../../models/membership-request';

@Component({
  selector: 'app-membership-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './memberships-form.html',
  styleUrl: './memberships-form.css'
})
export class MembershipsForm {

  private fb = inject(FormBuilder);
  private membershipService = inject(MembershipService);
  private usersService = inject(UsersService);
  private plansService = inject(MemebershipPlansService);
  private toastr = inject(ToastrService);

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isLoading = signal(false);
  members = signal<Users[]>([]);
  plans = signal<MemebershipPlans[]>([]);

  form = this.fb.group({
    memberId: ['', Validators.required],
    membershipPlanId: ['', Validators.required]
  });

  constructor() {
    this.loadMembers();
    this.loadPlans();
  }

  loadMembers(): void {
    this.usersService.getAllUsers().subscribe({
      next: users => {

        this.membershipService.getAllMemberships().subscribe({
          next: response => {

            const activeMemberIds = response.data
              .filter(membership => membership.status === 'ACTIVE')
              .map(membership => membership.member.id);

            this.members.set(
              users.filter(user =>
                user.role === 'MEMBER' &&
                user.status === 'ACTIVE' &&
                !activeMemberIds.includes(user.id)
              )
            );

          },
          error: err => {
            console.error(err);
            this.toastr.error(
              err.error?.message || 'Failed to load memberships.',
              'Error'
            );
          }
        });

      },
      error: err => {
        console.error(err);
        this.toastr.error(
          err.error?.message || 'Failed to load members.',
          'Error'
        );
      }
    });
  }

  loadPlans(): void {
    this.plansService.getAllPlans().subscribe({
      next: response => {
        this.plans.set(
          response.data.filter(plan => plan.isActive)
        );
      },
      error: err => {
        console.error(err);
        this.toastr.error(
          err.error?.message || 'Failed to load membership plans.',
          'Error'
        );
      }
    });
  }

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const body: CreateMembershipRequest = {
      memberId: this.form.value.memberId!,
      membershipPlanId: this.form.value.membershipPlanId!
    };

    this.membershipService.create(body).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastr.success(
          'Membership created successfully.',
          'Success'
        );
        this.saved.emit();
        this.close.emit();
      },
      error: err => {
        console.error(err);
        this.isLoading.set(false);
        this.toastr.error(
          err.error?.message || 'Failed to create membership.',
          'Error'
        );
      }
    });

  }

  cancel(): void {
    this.close.emit();
  }

}