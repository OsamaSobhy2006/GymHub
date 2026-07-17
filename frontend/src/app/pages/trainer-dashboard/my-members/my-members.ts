import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SessionsService } from '../../../services/session';

import { Session, SessionUser } from '../../../models/session';

import { MyMembersDetails } from './my-members-details/my-members-details';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-members',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MyMembersDetails
  ],
  templateUrl: './my-members.html',
  styleUrl: './my-members.css'
})
export class MyMembers implements OnInit {

  private readonly sessionsService = inject(SessionsService);
  private readonly toastr = inject(ToastrService);

  isLoading = signal(true);

  sessions = signal<Session[]>([]);

  search = signal('');

  apiUrl = environment.apiUrl;
  isDetailsOpen = signal(false);

  selectedMember = signal<SessionUser | null>(null);

  members = computed(() => {

    const membersMap = new Map<string, SessionUser>();

    this.sessions().forEach(session => {
      if (!membersMap.has(session.member.id)) {
        membersMap.set(session.member.id, session.member);
      }
    });

    return [...membersMap.values()];

  });

  filteredMembers = computed(() => {

    const keyword = this.search().trim().toLowerCase();

    if (!keyword) {
      return this.members();
    }

    return this.members().filter(member =>
      member.fullname.toLowerCase().includes(keyword) ||
      member.email.toLowerCase().includes(keyword)
    );

  });

  totalMembers = computed(() => {
    return this.members().length;
  });

  totalSessions = computed(() => {
    return this.sessions().length;
  });

  completedSessions = computed(() => {
    return this.sessions().filter(session => session.status === 'COMPLETED').length;
  });

  upcomingSessions = computed(() => {
    return this.sessions().filter(session => session.status === 'SCHEDULED').length;
  });

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {

    this.isLoading.set(true);

    this.sessionsService.getTrainerSessions().subscribe({
      next: (response) => {
        this.sessions.set(response.data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.error(err);
        this.toastr.error(err.error?.message || 'Failed to load members.');
      }
    });

  }

  getMemberSessions(memberId: string): Session[] {

    return this.sessions().filter(session => session.member.id === memberId);

  }


  getMemberImage(member: SessionUser): string {

    if (!member.profileImage) {
      return 'assets/images/default-avatar.png';
    }

    return `${this.apiUrl}${member.profileImage}`;

  }

  getCompletedSessions(memberId: string): number {

    return this.sessions().filter(session =>
      session.member.id === memberId &&
      session.status === 'COMPLETED'
    ).length;

  }

  getScheduledSessions(memberId: string): number {

    return this.sessions().filter(session =>
      session.member.id === memberId &&
      session.status === 'SCHEDULED'
    ).length;

  }

  getCancelledSessions(memberId: string): number {

    return this.sessions().filter(session =>
      session.member.id === memberId &&
      session.status === 'CANCELLED'
    ).length;

  }

  openDetails(member: SessionUser): void {

    this.selectedMember.set(member);

    this.isDetailsOpen.set(true);

  }

  closeDetails(): void {

    this.selectedMember.set(null);

    this.isDetailsOpen.set(false);

  }

}