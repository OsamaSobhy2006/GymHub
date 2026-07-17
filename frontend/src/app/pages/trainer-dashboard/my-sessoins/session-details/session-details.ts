import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Session } from '../../../../models/session';

@Component({
  selector: 'app-session-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './session-details.html',
  styleUrl: './session-details.css'
})
export class SessionDetails {

  @Input({ required: true }) session!: Session;

  @Output() close = new EventEmitter<void>();

  apiUrl = environment.apiUrl;

  closeModal(): void {
    this.close.emit();
  }

  getMemberImage(): string {
    if (!this.session.member.profileImage) {
      return 'assets/images/default-avatar.png';
    }

    return `${this.apiUrl}${this.session.member.profileImage}`;
  }

  getTrainerImage(): string {
    if (!this.session.trainer.profileImage) {
      return 'assets/images/default-avatar.png';
    }

    return `${this.apiUrl}${this.session.trainer.profileImage}`;
  }

  getStatusClass(): string {
    switch (this.session.status) {
      case 'SCHEDULED':
        return 'scheduled';
      case 'COMPLETED':
        return 'completed';
      case 'CANCELLED':
        return 'cancelled';
      default:
        return '';
    }
  }

}