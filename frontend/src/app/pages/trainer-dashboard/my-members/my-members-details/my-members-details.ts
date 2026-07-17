import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Session, SessionUser } from '../../../../models/session';


@Component({
  selector: 'app-my-members-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './my-members-details.html',
  styleUrl: './my-members-details.css'
})
export class MyMembersDetails {

  @Input({ required: true }) member!: SessionUser;

  @Input({ required: true }) sessions: Session[] = [];

  @Output() close = new EventEmitter<void>();

  apiUrl = environment.apiUrl;

  totalSessions = computed(() => {
    return this.sessions.length;
  });

  completedSessions = computed(() => {
    return this.sessions.filter(session => session.status === 'COMPLETED').length;
  });

  scheduledSessions = computed(() => {
    return this.sessions.filter(session => session.status === 'SCHEDULED').length;
  });

  cancelledSessions = computed(() => {
    return this.sessions.filter(session => session.status === 'CANCELLED').length;
  });

  getProfileImage(): string {

    if (!this.member.profileImage) {
      return 'assets/images/default-avatar.png';
    }

    return `${this.apiUrl}${this.member.profileImage}`;

  }

  closeModal(): void {
    this.close.emit();
  }

}