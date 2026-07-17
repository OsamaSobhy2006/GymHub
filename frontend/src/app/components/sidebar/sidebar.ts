import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  authService = inject(AuthService)
  router = inject(Router)
  toastr = inject(ToastrService)

  logout(): void {
    this.authService.logout();
    this.toastr.success('Logged out successfully')
    this.router.navigateByUrl('/')
  }
}
