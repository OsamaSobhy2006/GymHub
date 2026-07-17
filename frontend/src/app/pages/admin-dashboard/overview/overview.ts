import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from '../../../services/dashboard';
import { DashboardResponse } from '../../../models/dashboard';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit {

  private readonly dashboardService = inject(DashboardService);

  dashboard = signal<DashboardResponse | null>(null);

  isLoading = signal(true);

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (response) => {
        this.dashboard.set(response);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

}