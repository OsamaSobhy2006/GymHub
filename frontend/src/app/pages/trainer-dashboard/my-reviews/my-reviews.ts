import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../services/auth';
import { Reviews } from '../../../services/reviews';

import { Review, ReviewMember } from '../../../models/review';

import { MyReviewsDetails } from './my-reviews-details/my-reviews-details';
import { SessionUser } from '../../../models/session';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MyReviewsDetails
  ],
  templateUrl: './my-reviews.html',
  styleUrl: './my-reviews.css'
})
export class TrainerReviews implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly reviewsService = inject(Reviews);
  private readonly toastr = inject(ToastrService);

  isLoading = signal(true);

  reviews = signal<Review[]>([]);

  search = signal('');

  isDetailsOpen = signal(false);

  apiUrl = environment.apiUrl

  selectedReview = signal<Review | null>(null);

  filteredReviews = computed(() => {

    const keyword = this.search().trim().toLowerCase();

    if (!keyword) {
      return this.reviews();
    }

    return this.reviews().filter(review =>
      review.member.fullname.toLowerCase().includes(keyword) ||
      review.member.email.toLowerCase().includes(keyword) ||
      review.comment.toLowerCase().includes(keyword)
    );

  });

  totalReviews = computed(() => {
    return this.reviews().length;
  });

  averageRating = computed(() => {

    if (!this.reviews().length) {
      return 0;
    }

    const total = this.reviews().reduce((sum, review) => sum + review.rating, 0);

    return +(total / this.reviews().length).toFixed(1);

  });

  fiveStars = computed(() => {

    return this.reviews().filter(review => review.rating === 5).length;

  });

  recentReviews = computed(() => {

    return [...this.reviews()]
      .sort((a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      ).length;

  });

  ngOnInit(): void {

    this.loadReviews();

  }

  loadReviews(): void {

    this.isLoading.set(true);

    const trainer = this.authService.currentUser();

    if (!trainer) {

      this.toastr.error('Trainer not found.');

      this.isLoading.set(false);

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

        this.toastr.error(
          err.error?.message || 'Failed to load reviews.'
        );

      }

    });

  }

    getMemberImage(member: ReviewMember): string {

    if (!member.profileImage) {
      return 'assets/images/default-avatar.png';
    }

    return `${this.apiUrl}${member.profileImage}`;

  }

  openDetails(review: Review): void {

    this.selectedReview.set(review);

    this.isDetailsOpen.set(true);

  }

  closeDetails(): void {

    this.selectedReview.set(null);

    this.isDetailsOpen.set(false);

  }

}