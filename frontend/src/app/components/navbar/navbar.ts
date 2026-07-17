import { environment } from './../../../environments/environment';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  protected environment = environment

  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  logout(): void {
    this.authService.logout()
    this.isDropdownOpen = false;
    this.router.navigateByUrl('/')
  }

}
