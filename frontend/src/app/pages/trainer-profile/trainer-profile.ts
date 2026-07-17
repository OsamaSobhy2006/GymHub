import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';


import { AuthUser } from '../../models/auth-user';
import { Review } from '../../models/review';


import { environment } from '../../../environments/environment';
import { Rating } from '../rating/rating';
import { UsersService } from '../../services/users';
import { Reviews } from '../../services/reviews';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-trainer-profile',
  imports: [
    DatePipe,
    Rating,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './trainer-profile.html',
  styleUrl: './trainer-profile.css'
})
export class TrainerProfile implements OnInit {

  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private reviewsService = inject(Reviews);
  environment = environment;
  trainer = signal<AuthUser | null>(null);
  reviews = signal<Review[]>([]);
  averageRating = signal(0);
  totalReviews = signal(0);
  isLoading = signal(true);
  fb = inject(NonNullableFormBuilder)
  toastr = inject(ToastrService)
  authService = inject(AuthService)
  selectedRating = signal(0)
  isSubmitting = signal(false)
  openMenu = signal<string | null>(null);
  editingReviewId = signal<string | null>(null);
  hasUserReviewed = signal(false);


  reviewForm = this.fb.group({
    comment: [
        '',
        [
            Validators.required,
            Validators.minLength(10)
        ]
    ]
  });

  selectRating(rating:number){
    this.selectedRating.set(rating);
  }

  ngOnInit(): void {
    const trainerId = this.route.snapshot.paramMap.get('id');
    if (!trainerId) {
      return;
    }
    this.loadTrainer(trainerId);
    this.loadReviews(trainerId);

  }

  loadTrainer(id: string): void {
    this.usersService.getPublicTrainer(id).subscribe({
      next: (trainer) => {
        this.trainer.set(trainer);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.log(error);
        this.isLoading.set(false);
      }
    });
  }

  loadReviews(id: string): void {
    this.reviewsService.getTrainerReviews(id).subscribe({
      next: (response) => {

        this.averageRating.set(
          response.data.averageRating
        );

        this.totalReviews.set(
          response.data.totalReviews
        );

        this.reviews.set(
          response.data.reviews
        );
        const currentUser = this.authService.currentUser();
        this.hasUserReviewed.set( !!currentUser && response.data.reviews.some(
          review => review.member.id === currentUser.id
    )

  );

      },

      error: (error) => {
        console.log(error);
      }
    });
  }

  submitReview(): void {

    if (this.editingReviewId()) {

        this.updateReview();

        return;

    }

    if(this.selectedRating() === 0){

        this.toastr.error(
            'Please select a rating.',
            'Error'
        );

        return;

    }

    if(this.reviewForm.invalid){

        this.reviewForm.markAllAsTouched();

        return;

    }

    const trainerId = this.route.snapshot.paramMap.get('id');

    if(!trainerId){

        return;

    }

    this.isSubmitting.set(true);

    this.reviewsService.createReview(

        trainerId,

        {
            rating: this.selectedRating(),
            comment: this.reviewForm.getRawValue().comment
        }

    ).subscribe({

        next:()=>{

            this.toastr.success(
                'Review added successfully.',
                'Success'
            );

            this.reviewForm.reset();

            this.selectedRating.set(0);

            this.loadReviews(trainerId);

            this.isSubmitting.set(false);

        },

        error:(error)=>{

            this.toastr.error(
                error.error.message,
                'Error'
            );

            this.isSubmitting.set(false);

        }

    });

}

  toggleMenu(id: string){
    if(this.openMenu() === id){
        this.openMenu.set(null);
    }
    else{
        this.openMenu.set(id);
    }
  }

  deleteReview(id: string): void {
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }
    this.reviewsService.deleteReview(id).subscribe({
        next: () => {
            this.toastr.success(
                'Review deleted successfully',
                'Success'
            );
            this.openMenu.set(null);
            this.hasUserReviewed.set(false);
            const trainerId = this.route.snapshot.paramMap.get('id');
            if (trainerId) {
                this.loadReviews(trainerId);
            }
        },
        error: (error) => {
            this.toastr.error(
                error.error.message,
                'Error'
            );
        }
    });
  }

  editReview(review: Review): void {
    this.editingReviewId.set(review.id);
    this.hasUserReviewed.set(false);
    this.selectedRating.set(review.rating);
    this.reviewForm.patchValue({
        comment: review.comment
    });
    this.openMenu.set(null);
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
  } 

  updateReview(): void {
    const reviewId = this.editingReviewId();
    if (!reviewId) {
        return;
    }
    this.isSubmitting.set(true);
    this.reviewsService.updateReview(
        reviewId,
        {
            rating: this.selectedRating(),
            comment: this.reviewForm.getRawValue().comment
        }
    ).subscribe({
        next: () => {
            this.toastr.success(
                'Review updated successfully',
                'Success'
            );
            this.reviewForm.reset();
            this.selectedRating.set(0);
            this.editingReviewId.set(null);
            this.hasUserReviewed.set(true);
            const trainerId = this.route.snapshot.paramMap.get('id');
            if (trainerId) {
                this.loadReviews(trainerId);
            }
            this.isSubmitting.set(false);
        },
        error: (error) => {
            this.toastr.error(
                error.error.message,
                'Error'
            );
            this.isSubmitting.set(false);
        }
    });
  }

}