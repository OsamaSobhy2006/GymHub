import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Membership } from '../../../models/memebersip-plans';
import { MembershipService } from '../../../services/membership';
import { MembershipsForm } from './components/memberships-form/memberships-form';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MembershipsForm
  ],
  templateUrl: './memberships.html',
  styleUrl: './memberships.css'
})
export class Memberships implements OnInit {

  private readonly membershipService = inject(MembershipService);
  private readonly toastr = inject(ToastrService);

  isLoading = signal(true);
  memberships = signal<Membership[]>([]);
  search = signal('');
  isFormOpen = signal(false);
  selectedMembership = signal<Membership | null>(null);

  filteredMemberships = computed(() => {
    const keyword = this.search().trim().toLowerCase();

    return this.memberships().filter(membership =>
      membership.member.fullname.toLowerCase().includes(keyword) ||
      membership.member.email.toLowerCase().includes(keyword) ||
      membership.membershipPlan.name.toLowerCase().includes(keyword)
    );
  });

  ngOnInit(): void {
    this.loadMemberships();
  }

  loadMemberships(): void {
    this.isLoading.set(true);

    this.membershipService.getAllMemberships().subscribe({
      next: (response) => {
        this.memberships.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(
          err.error?.message || 'Failed to load memberships.',
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

  openCreateForm(): void {
    this.selectedMembership.set(null);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.selectedMembership.set(null);
    this.loadMemberships();
  }

  renewMembership(id: string): void {
    const confirmed = confirm('Renew this membership?');

    if (!confirmed) return;

    this.membershipService.renew(id).subscribe({
      next: () => {
        this.toastr.success(
          'Membership renewed successfully.',
          'Success'
        );
        this.loadMemberships();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(
          err.error?.message || 'Failed to renew membership.',
          'Error'
        );
      }
    });
  }

  deleteMembership(id: string): void {
    const confirmed = confirm('Deactivate this membership?');

    if (!confirmed) return;

    this.membershipService.delete(id).subscribe({
      next: () => {
        this.toastr.success(
          'Membership deactivated successfully.',
          'Success'
        );
        this.loadMemberships();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(
          err.error?.message || 'Failed to deactivate membership.',
          'Error'
        );
      }
    });
  }

}