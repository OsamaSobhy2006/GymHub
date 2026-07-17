import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { Users } from '../../../models/users';
import { UsersService } from '../../../services/users';
import { TrainerForm } from './components/trainer-form/trainer-form';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TrainerForm
  ],
  templateUrl: './trainers.html',
  styleUrl: './trainers.css',
})
export class TrainersDash implements OnInit {

  private readonly usersService = inject(UsersService);

  apiUrl = environment.apiUrl;

  isLoading = signal(true);

  users = signal<Users[]>([]);

  search = signal('');

  isFormOpen = signal(false);

  selectedTrainer = signal<Users | null>(null);

  trainers = computed(() => {

    const keyword = this.search().trim().toLowerCase();

    return this.users().filter(user =>

      user.role === 'TRAINER' &&

      (

        user.fullname.toLowerCase().includes(keyword) ||

        user.email.toLowerCase().includes(keyword)

      )

    );

  });

  ngOnInit(): void {

    this.loadTrainers();

  }

  loadTrainers(): void {

    this.isLoading.set(true);

    this.usersService.getAllUsers().subscribe({

      next: (users) => {

        this.users.set(users);

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

  openEditForm(trainer: Users): void {

    this.selectedTrainer.set(trainer);

    this.isFormOpen.set(true);

  }

  closeForm(): void {

    this.isFormOpen.set(false);

    this.selectedTrainer.set(null);

    this.loadTrainers();

  }

  deleteTrainer(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to deactivate this trainer?'
    );

    if (!confirmed) return;

    this.usersService.delete(id).subscribe({

      next: () => {

        this.loadTrainers();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

}