import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { MemebershipPlans } from '../../../models/memebersip-plans';
import { MemebershipPlansService } from '../../../services/memebership-plans';

import { MembershipPlanFormComponent } from './components/membership-plan-form/membership-plan-form';

@Component({
  selector: 'app-membership-plans',
  standalone: true,
  imports: [
    CommonModule,
    MembershipPlanFormComponent
],
  templateUrl: './membership-plan.html',
  styleUrl: './membership-plan.css',
})
export class MembershipPlans implements OnInit {

  private readonly plansService = inject(MemebershipPlansService);

  isLoading = signal(true);

  plans = signal<MemebershipPlans[]>([]);

  search = signal('');

  isFormOpen = signal(false);

  selectedPlan = signal<MemebershipPlans | null>(null);

  filteredPlans = computed(() => {

    const keyword = this.search().trim().toLowerCase();

    return this.plans().filter(plan =>
      plan.name.toLowerCase().includes(keyword)
    );

  });

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {

    this.isLoading.set(true);

    this.plansService.getAllPlans().subscribe({

      next: (response) => {

        this.plans.set(response.data);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

      }

    });

  }

  onSearch(event: Event): void {

    const value = (event.target as HTMLInputElement).value;

    this.search.set(value);

  }

  openCreateForm(): void {

    this.selectedPlan.set(null);

    this.isFormOpen.set(true);

  }

  openEditForm(plan: MemebershipPlans): void {

    this.selectedPlan.set(plan);

    this.isFormOpen.set(true);

  }

  closeForm(): void {

    this.isFormOpen.set(false);

    this.selectedPlan.set(null);

    this.loadPlans();

  }

  deactivatePlan(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to deactivate this membership plan?'
    );

    if (!confirmed) return;

    this.plansService.delete(id).subscribe({

      next: () => {

        this.loadPlans();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

}