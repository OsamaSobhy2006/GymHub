import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Session } from '../../../models/session';
import { SessionsService } from '../../../services/session';
import { SessionForm } from './components/session-form/session-form';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    SessionForm
],
  templateUrl: './session.html',
  styleUrl: './session.css'
})
export class Sessions implements OnInit {

  private readonly sessionsService = inject(SessionsService);
  private readonly toastr = inject(ToastrService);

  isLoading = signal(true);

  sessions = signal<Session[]>([]);

  search = signal('');

  isFormOpen = signal(false);

  mode = signal<'create' | 'edit'>('create');

  selectedSession = signal<Session | null>(null);

  filteredSessions = computed(() => {

    const keyword = this.search().trim().toLowerCase();

    return this.sessions().filter(session =>

      session.member.fullname.toLowerCase().includes(keyword) ||

      session.trainer.fullname.toLowerCase().includes(keyword) ||

      session.title.toLowerCase().includes(keyword)

    );

  });

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {

    this.isLoading.set(true);

    this.sessionsService.getAllSessions().subscribe({

      next: (response) => {

        this.sessions.set(response.data);

        this.isLoading.set(false);

      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err.error?.message || 'Failed to load sessions.',
          'Error'
        );

        this.isLoading.set(false);

      }

    });

  }

  onSearch(event: Event): void {

    const value = (event.target as HTMLInputElement).value;

    this.search.set(value);

  }

  openCreateForm(): void {

    this.mode.set('create');

    this.selectedSession.set(null);

    this.isFormOpen.set(true);

  }

  openEditForm(session: Session): void {

    this.mode.set('edit');

    this.selectedSession.set(session);

    this.isFormOpen.set(true);

  }

  closeForm(): void {

    this.isFormOpen.set(false);

    this.selectedSession.set(null);

    this.loadSessions();

  }

  cancelSession(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to cancel this session?'
    );

    if (!confirmed) return;

    this.sessionsService.cancelSession(id).subscribe({

      next: () => {

        this.toastr.success(
          'Session cancelled successfully.',
          'Success'
        );

        this.loadSessions();

      },

      error: (err) => {

        console.error(err);

        this.toastr.error(
          err.error?.message || 'Failed to cancel session.',
          'Error'
        );

      }

    });

  }

}