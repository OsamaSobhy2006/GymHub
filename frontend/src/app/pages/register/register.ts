import { Component, inject, signal } from '@angular/core';
import { AuthBanner } from "../../layouts/auth-banner/auth-banner";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth';
import {  NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../validators/password-match';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [AuthBanner, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fb = inject(NonNullableFormBuilder)
  authService = inject(AuthService)
  router = inject(Router)
  toastr = inject(ToastrService)

  isLoading = signal(false);


  registerForm = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  },{
    validators: passwordMatchValidator
  }
)

  get fullname() {
    return this.registerForm.get('fullname')
  }

  get email() {
    return this.registerForm.get('email')
  }

  get password() {
    return this.registerForm.get('password')
  }

  get confirmPassword(){
    return this.registerForm.get('confirmPassword')
  }

  onSubmit(){
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched()

      return
    }
    this.isLoading.set(true);

    const { confirmPassword, ...user } = this.registerForm.getRawValue()


    this.authService.register(user).subscribe({
      next: (response) => {
        this.authService.saveSession(response)
        this.toastr.success(response.message, 'Success')
        this.isLoading.set(false);
        this.router.navigateByUrl('/')
      },
      error: (error) => {
        this.isLoading.set(false)
        this.toastr.error(error.error.message, 'Error')
        console.log(error)
      }
    })
  }


}
