import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { UsersService } from '../../services/users';
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { AuthUser } from '../../models/auth-user';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [ɵInternalFormsSharedModule, DatePipe, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  fb = inject(NonNullableFormBuilder)
  usersService = inject(UsersService)
  authService = inject(AuthService)
  toastr = inject(ToastrService)

  user = signal<AuthUser | null>(null)
  isLoading = signal(false)
  protected environment = environment

  selectedFile: File | null = null;
  selectedImage = signal<string | null>(null);
  isUploading = signal(false);

  profileForm = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  })

  ngOnInit(): void {
    this.loadProfile()
  }

  loadProfile(): void {
    this.usersService.getMe().subscribe({
      next: (user) => {
        this.user.set(user)
        this.profileForm.patchValue({
          fullname: user.fullname,
          email: user.email
        })
      }
    })
  }

  onSubmit(): void {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }
  const currentUser = this.user();
  if (!currentUser) {
    return;
  }
  this.isLoading.set(true);
  this.usersService.update(currentUser.id, this.profileForm.getRawValue()).subscribe({
    next: () => {
      this.usersService.getMe().subscribe({
        next: (user) => {
          this.user.set(user);
          this.authService.currentUser.set(user);
          this.toastr.success(
            'Profile updated successfully',
            'Success'
          );
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.toastr.error(
            error.error.message,
            'Error'
          );
        }
      });
    },
    error: (error) => {
      this.isLoading.set(false);
      this.toastr.error(
        error.error.message,
        'Error'
      );
    }
  });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if(!input.files?.length){
        return;
    }
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        this.selectedImage.set(reader.result as string);
    };
    reader.readAsDataURL(this.selectedFile);
  }

  uploadImage(): void {
    if(!this.selectedFile){
        return;
    }
    this.isUploading.set(true);
    this.usersService.uploadProfileImage(this.selectedFile).subscribe({
        next: () => {
            this.usersService.getMe().subscribe({
                next: (user) => {
                    this.user.set(user);
                    this.authService.currentUser.set(user);
                    this.selectedFile = null;
                    this.selectedImage.set(null);
                    this.toastr.success(
                        'Profile image updated successfully.',
                        'Success'
                    );
                    this.isUploading.set(false);
                }
            });
        },
        error: (error) => {
            this.isUploading.set(false);
            this.toastr.error(
                error.error.message,
                'Error'
            );
        }
    });
  }
}
