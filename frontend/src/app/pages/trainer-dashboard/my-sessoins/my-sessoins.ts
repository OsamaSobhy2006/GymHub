import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SessionsService } from '../../../services/session';

import { Session } from '../../../models/session';

import { SessionDetails } from './session-details/session-details';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-sessions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SessionDetails
  ],
  templateUrl: './my-sessions.html',
  styleUrl: './my-sessions.css'
})
export class MySessionsDash implements OnInit {

  private readonly sessionsService = inject(SessionsService);
  private readonly toastr = inject(ToastrService);
  @Input({ required: true }) session!: Session;
  private apiUrl = environment.apiUrl

  isLoading = signal(true);

  sessions = signal<Session[]>([]);

  search = signal('');

  isDetailsOpen = signal(false);

  selectedSession = signal<Session | null>(null);

  filteredSessions = computed(() => {

    const keyword = this.search().trim().toLowerCase();

    if (!keyword) {
      return this.sessions();
    }

    return this.sessions().filter(session =>
      session.member.fullname.toLowerCase().includes(keyword) ||
      session.member.email.toLowerCase().includes(keyword) ||
      session.title.toLowerCase().includes(keyword)
    );

  });

  totalSessions = computed(() => {
    return this.sessions().length;
  });

  scheduledSessions = computed(() => {
    return this.sessions().filter(session => session.status === 'SCHEDULED').length;
  });

  completedSessions = computed(() => {
    return this.sessions().filter(session => session.status === 'COMPLETED').length;
  });

  cancelledSessions = computed(() => {
    return this.sessions().filter(session => session.status === 'CANCELLED').length;
  });

  getMemberImage(session: Session): string {
    if (!session.member.profileImage) {
        return 'assets/images/default-avatar.png';
    }
    return `${environment.apiUrl}${session.member.profileImage}`;
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {

    this.isLoading.set(true);

    this.sessionsService.getTrainerSessions().subscribe({
      next: (response) => {
        this.sessions.set(response.data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.error(err);
        this.toastr.error(err.error?.message || 'Failed to load sessions.');
      }
    });

  }

  openDetails(session: Session): void {

    this.selectedSession.set(session);

    this.isDetailsOpen.set(true);

  }

  closeDetails(): void {

    this.selectedSession.set(null);

    this.isDetailsOpen.set(false);

  }

}