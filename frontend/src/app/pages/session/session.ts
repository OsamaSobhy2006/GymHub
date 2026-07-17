import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { Session } from '../../models/session';
import { SessionsService } from '../../services/session';

@Component({
  selector: 'app-my-sessions',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './session.html',
  styleUrl: './session.css',
})
export class MySessions implements OnInit {

  private readonly sessionsService = inject(SessionsService);
  private readonly toastr = inject(ToastrService);

  sessions = signal<Session[]>([]);
  isLoading = signal(true);

  cancellingSession = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions() {
    this.sessionsService.getMySessions().subscribe({
      next: (res) => {
        this.sessions.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  cancelSession(id: string) {

    const confirmed = confirm('Are you sure you want to cancel this session?')
    if(!confirmed) 
      return;

    this.cancellingSession.set(id);

    this.sessionsService.cancelSession(id).subscribe({

      next: () => {

        this.toastr.success(
          'Session cancelled successfully.'
        );

        this.loadSessions();

        this.cancellingSession.set(null);

      },

      error: () => {

        this.toastr.error(
          'Unable to cancel session.'
        );

        this.cancellingSession.set(null);

      }

    });

  }

}