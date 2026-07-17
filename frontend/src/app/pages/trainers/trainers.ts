import { environment } from './../../../environments/environment';
import { Component, computed, inject, signal } from '@angular/core';
import { UsersService } from '../../services/users';
import { Trainer } from '../../models/trainer';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { Rating } from "../rating/rating";

@Component({
  selector: 'app-trainers',
  imports: [FormsModule, RouterLink, Rating],
  templateUrl: './trainers.html',
  styleUrl: './trainers.css',
})
export class Trainers {
  usersService = inject(UsersService)
  environment = environment
  trainers = signal<Trainer[]>([])
  isLoading = signal(false)
  search = signal('')

  filteredTrainers = computed(() => {
    const keyword = this.search().trim().toLowerCase();
    if (!keyword) {
      return this.trainers();
    }
    return this.trainers().filter(trainer =>
      trainer.fullname.toLowerCase().includes(keyword)
    );
  });

  ngOnInit() {
    this.loadTrainers()
  }

  loadTrainers(): void {
    this.usersService.getAllTrainers().subscribe({
        next: (trainers) => {
            this.trainers.set(trainers);
            this.isLoading.set(false);
        },
        error: (error) => {
            console.log(error);
            this.isLoading.set(false);
        }
    });
  }
}
