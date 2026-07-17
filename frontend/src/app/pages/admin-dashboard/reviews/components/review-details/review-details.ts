import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Review } from '../../../../../models/review';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-review-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './review-details.html',
  styleUrl: './review-details.css'
})
export class ReviewDetails {

  @Input({ required: true }) review!: Review;

  @Output() close = new EventEmitter<void>();

  apiUrl = environment.apiUrl;

  closeModal(): void {
    this.close.emit();
  }

  getMemberImage(): string {
    if (!this.review.member.profileImage) {
      return 'assets/images/default-avatar.png';
    }
    return `${this.apiUrl}${this.review.member.profileImage}`;
  }

  getTrainerImage(): string {
    if (!this.review.trainer.profileImage) {
      return 'assets/images/default-avatar.png';
    }
    return `${this.apiUrl}${this.review.trainer.profileImage}`;
  }

}