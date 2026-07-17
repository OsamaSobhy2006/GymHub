import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UsersService } from '../../../../../services/users';
import { Users } from '../../../../../models/users';
import { UpdateUserRequest } from '../../../../../models/update-user-request';

@Component({
  selector: 'app-trainer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './trainer-form.html',
  styleUrl: './trainer-form.css',
})
export class TrainerForm implements OnChanges {

  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);

  @Input({ required: true })
  trainer: Users | null = null;



  @Output()
  close = new EventEmitter<void>();

  @Output()
  saved = new EventEmitter<void>();

  isLoading = signal(false);

  form = this.fb.group({

    fullname: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
      ],
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],

  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['trainer'] && this.trainer) {

      this.form.patchValue({

        fullname: this.trainer.fullname,

        email: this.trainer.email,

      });

    }

  }

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.isLoading.set(true);

    const body: UpdateUserRequest = {

      fullname: this.form.value.fullname!,

      email: this.form.value.email!,

    };

    this.usersService.update(this.trainer!.id, body).subscribe({

      next: () => {

        this.isLoading.set(false);

        this.saved.emit();

        this.close.emit();

      },

      error: (err) => {

        console.error(err);

        this.isLoading.set(false);

      },

    });

  }

  cancel(): void {

    this.close.emit();

  }

}