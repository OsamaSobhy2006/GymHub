import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Review, ReviewsResponse } from '../../../models/review';
import { Reviews } from '../../../services/reviews';
import { ReviewDetails } from './components/review-details/review-details';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReviewDetails
  ],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class ReviewDash implements OnInit {

  private readonly reviewsService = inject(Reviews);
  private readonly toastr = inject(ToastrService);

  isLoading = signal(true);
  reviews = signal<Review[]>([]);
  search = signal('');

  isDetailsOpen = signal(false);
  selectedReview = signal<Review | null>(null);

  filteredReviews = computed(() => {
    const keyword = this.search().trim().toLowerCase();
    return this.reviews().filter(review =>
      review.member.fullname.toLowerCase().includes(keyword) ||
      review.member.email.toLowerCase().includes(keyword) ||
      review.trainer.fullname.toLowerCase().includes(keyword) ||
      review.trainer.email.toLowerCase().includes(keyword) ||
      review.comment.toLowerCase().includes(keyword)
    );
  });

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading.set(true);
    this.reviewsService.getAllreviews().subscribe({
      next: (response) => {
        this.reviews.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error(err.error?.message || 'Failed to load reviews.');
        console.error(err);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
  }

  openDetails(review: Review): void {
    this.selectedReview.set(review);
    this.isDetailsOpen.set(true);
  }

  closeDetails(): void {
    this.selectedReview.set(null);
    this.isDetailsOpen.set(false);
  }

  deleteReview(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this review?');
    if (!confirmed) return;

    this.reviewsService.deleteReview(id).subscribe({
      next: () => {
        this.toastr.success('Review deleted successfully.');
        this.loadReviews();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to delete review.');
        console.error(err);
      }
    });
  }

}