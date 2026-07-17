import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Review } from '../../../../models/review';


@Component({
  selector: 'app-my-reviews-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './my-reviews-details.html',
  styleUrl: './my-reviews-details.css'
})
export class MyReviewsDetails {

  @Input({ required: true }) review!: Review;

  @Output() close = new EventEmitter<void>();

  apiUrl = environment.apiUrl;

  getMemberImage(): string {

    if (!this.review.member.profileImage) {
      return 'assets/images/default-avatar.png';
    }

    return `${this.apiUrl}${this.review.member.profileImage}`;

  }

  getStars(): number[] {

    return Array.from(
      { length: this.review.rating },
      (_, index) => index
    );

  }

  getEmptyStars(): number[] {

    return Array.from(
      { length: 5 - this.review.rating },
      (_, index) => index
    );

  }

  closeModal(): void {

    this.close.emit();

  }

}