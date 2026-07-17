import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class Rating {
  rating = input.required<number>();
  showText = input(true);

  totalReviews = input(0);

  stars = computed(() => {
    const roundedRating = Math.round(this.rating());
    return Array.from({ length: 5 }, (_, index) => index < roundedRating);
  });
}
