import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipService } from '../../services/membership';
import { Membership } from '../../models/memebersip-plans';

@Component({
  selector: 'app-my-membership',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-membership.html',
  styleUrl: './my-membership.css',
})
export class MyMembership implements OnInit {

  private readonly membershipService = inject(MembershipService);

  memberships = signal<Membership[]>([]);
  isLoading = signal(true);

  currentMembership = computed(() =>
    this.memberships().find(
      membership => membership.status === 'ACTIVE'
    ) ?? null
  );

  ngOnInit(): void {
    this.loadMemberships();
  }

  loadMemberships(): void {
    this.membershipService.getMyMembership().subscribe({
      next: (response) => {
        this.memberships.set(response.data);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error(error);
        this.isLoading.set(false);
      },
    });
  }

  remainingDays(endDate: string): number {
    const today = new Date();

    const end = new Date(endDate);

    const diff =
      end.getTime() - today.getTime();

    return Math.max(
      Math.ceil(diff / (1000 * 60 * 60 * 24)),
      0
    );
  }

  isExpired(endDate: string): boolean {
    return new Date(endDate).getTime() < new Date().getTime();
  }

}