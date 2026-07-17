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
import { CreateUserRequest, Users } from '../../../../../models/users';
import { UpdateUserRequest } from '../../../../../models/update-user-request';


@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './member-form.html',
  styleUrl: './member-form.css',
})
export class MemberFormComponent implements OnChanges {

  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);

  @Input({ required: true })
  mode!: 'create' | 'edit';

  @Input()
  member: Users | null = null;

  @Output()
  close = new EventEmitter<void>();

  @Output()
  saved = new EventEmitter<void>();

  isLoading = signal(false);

  form = this.fb.group({
    fullname: ['', [ Validators.required, Validators.minLength(3)]],
    email: ['',[Validators.required, Validators.email]],
    password: [''],
    role: ['MEMBER'],
  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['member']) {
      if (this.mode === 'edit' && this.member) {
        this.form.patchValue({
          fullname: this.member.fullname,
          email: this.member.email,
        });
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
      }

      if (this.mode === 'create') {

        this.form.reset({
          fullname: '',
          email: '',
          password: '',
          role: 'MEMBER',
        });

        this.form.get('password')?.setValidators([
          Validators.required,
          Validators.minLength(8),
        ]);
        this.form.get('password')?.updateValueAndValidity();
      }
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    if (this.mode === 'create') {
      const body: CreateUserRequest = {
        fullname: this.form.value.fullname!,
        email: this.form.value.email!,
        password: this.form.value.password!,
        role: this.form.value.role as 'MEMBER' | 'TRAINER',
      };

      this.usersService.create(body).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.saved.emit();
          this.close.emit();
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
      return;
    }

    const body: UpdateUserRequest = {
      fullname: this.form.value.fullname!,
      email: this.form.value.email!,
    };

    this.usersService.update(this.member!.id, body).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.saved.emit();
        this.close.emit();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  cancel(): void {
    this.close.emit();
  }

}