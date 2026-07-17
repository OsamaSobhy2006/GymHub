import { Component, inject, signal } from '@angular/core';
import { AuthBanner } from '../../layouts/auth-banner/auth-banner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    AuthBanner,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  isLoading = signal(false);

  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ]
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({

      next: (response) => {

        this.authService.saveSession(response);

        this.toastr.success(response.message, 'Success');

        this.router.navigateByUrl('/');

      },

      error: (error) => {

        this.isLoading.set(false);

        this.toastr.error(error.error.message, 'Error');

      }

    });

  }

}