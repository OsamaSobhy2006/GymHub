import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { SessionsService } from '../../../services/session';
import { Reviews } from '../../../services/reviews';
import { AuthService } from '../../../services/auth';

import { Session } from '../../../models/session';
import { Review } from '../../../models/review';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class TrainerOverview implements OnInit {

  private readonly sessionsService = inject(SessionsService);
  private readonly reviewsService = inject(Reviews);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  isLoading = signal(true);

  sessions = signal<Session[]>([]);
  reviews = signal<Review[]>([]);

  totalMembers = computed(() => {
    return new Set(this.sessions().map(session => session.member.id)).size;
  });

  upcomingSessions = computed(() => {
    const now = new Date();

    return this.sessions().filter(session =>
      session.status === 'SCHEDULED' &&
      new Date(session.date) >= now
    ).length;
  });

  averageRating = computed(() => {
    if (!this.reviews().length) {
      return 0;
    }

    const total = this.reviews().reduce((sum, review) => sum + review.rating, 0);

    return +(total / this.reviews().length).toFixed(1);
  });

  totalReviews = computed(() => {
    return this.reviews().length;
  });

  upcomingSessionsList = computed(() => {
    const now = new Date();

    return [...this.sessions()]
      .filter(session =>
        session.status === 'SCHEDULED' &&
        new Date(session.date) >= now
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  });

  latestReviews = computed(() => {
    return [...this.reviews()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading.set(true);

    this.sessionsService.getTrainerSessions().subscribe({
      next: (response) => {
        this.sessions.set(response.data);
        this.loadReviews();
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.error(err);
        this.toastr.error(err.error?.message || 'Failed to load sessions.');
      }
    });
  }

  loadReviews(): void {
    const trainer = this.authService.currentUser();

    if (!trainer) {
      this.isLoading.set(false);
      this.toastr.error('Unable to load trainer information.');
      return;
    }

    this.reviewsService.getTrainerReviews(trainer.id).subscribe({
      next: (response) => {
        this.reviews.set(response.data.reviews);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.error(err);
        this.toastr.error(err.error?.message || 'Failed to load reviews.');
      }
    });
  }

}