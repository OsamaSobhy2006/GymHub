import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trainer',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './trainer.html',
  styleUrl: './trainer.css'
})
export class Trainer {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);


    logout(): void {
    this.authService.logout();
    this.toastr.success('Logged out successfully')
    this.router.navigateByUrl('/')
  }

}