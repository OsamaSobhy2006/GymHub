import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Users } from '../../../models/users';
import { UsersService } from '../../../services/users';
import { MemberFormComponent } from "./components/member-form/member-form";

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, DatePipe, MemberFormComponent],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members implements OnInit {

  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  apiUrl = environment.apiUrl;
  isLoading = signal(true);
  users = signal<Users[]>([]);
  search = signal('');
  members = computed(() => {
    const keyword = this.search().trim().toLowerCase();
    return this.users().filter(user =>
      user.role === 'MEMBER' && (
        user.fullname.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      )
    );
  });
  isFormOpen = signal(false);
  mode = signal<'create' | 'edit'>('create');
  selectedMember = signal<Users | null>(null);

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
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

  viewMember(id: string): void {
    this.router.navigate(['/admin/members', id]);
  }

  openCreateForm() {
    this.mode.set('create');
    this.selectedMember.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(member: Users) {
    this.mode.set('edit');
    this.selectedMember.set(member);
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
    this.loadMembers()
  }

  deleteMember(id: string): void {
  const confirmed = confirm(
    'Are you sure you want to deactivate this member?'
  );
  if (!confirmed) {
    return;
  }
  this.usersService.delete(id).subscribe({
    next: () => {
      this.loadMembers();
    },
    error: (err) => {
      console.error(err);
    }
  });
  }

}