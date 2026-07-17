import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Session } from '../../../../../models/session';
import { CreateSessionRequest, UpdateSessionRequest } from '../../../../../models/session-request';
import { Trainer } from '../../../../../models/trainer';
import { Users } from '../../../../../models/users';
import { SessionsService } from '../../../../../services/session';
import { UsersService } from '../../../../../services/users';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './session-form.html',
  styleUrl: './session-form.css'
})
export class SessionForm {

  private fb = inject(FormBuilder);
  private sessionsService = inject(SessionsService);
  private usersService = inject(UsersService);
  private toastr = inject(ToastrService);

  @Input({ required: true }) mode!: 'create' | 'edit';
  @Input() session: Session | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isLoading = signal(false);
  members = signal<Users[]>([]);
  trainers = signal<Trainer[]>([]);

  form = this.fb.group({
    memberId: ['', Validators.required],
    trainerId: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.required],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });

  constructor() {
    this.loadMembers();
    this.loadTrainers();
  }

  ngOnChanges(): void {
    if (this.mode === 'edit' && this.session) {
      this.form.patchValue({
        memberId: this.session.member.id,
        trainerId: this.session.trainer.id,
        title: this.session.title,
        description: this.session.description,
        date: this.session.date.split('T')[0],
        startTime: this.session.startTime,
        endTime: this.session.endTime
      });
    }
  }

  loadMembers(): void {
    this.usersService.getAllUsers().subscribe({
      next: users => {
        this.members.set(
          users.filter(user =>
            user.role === 'MEMBER' &&
            user.status === 'ACTIVE'
          )
        );
      },
      error: err => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Failed to load members.');
      }
    });
  }

  loadTrainers(): void {
    this.usersService.getAllTrainers().subscribe({
      next: trainers => {
        this.trainers.set(trainers);
      },
      error: err => {
        console.error(err);
        this.toastr.error(err.error?.message || 'Failed to load trainers.');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    if (this.mode === 'create') {

      const body: CreateSessionRequest = {
        memberId: this.form.value.memberId!,
        trainerId: this.form.value.trainerId!,
        title: this.form.value.title!,
        description: this.form.value.description!,
        date: this.form.value.date!,
        startTime: this.form.value.startTime!,
        endTime: this.form.value.endTime!
      };

      this.sessionsService.create(body).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastr.success('Session created successfully.');
          this.saved.emit();
          this.close.emit();
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
          this.toastr.error(err.error?.message || 'Failed to create session.');
        }
      });

    } else {

      const body: UpdateSessionRequest = {
        memberId: this.form.value.memberId!,
        trainerId: this.form.value.trainerId!,
        title: this.form.value.title!,
        description: this.form.value.description!,
        date: this.form.value.date!,
        startTime: this.form.value.startTime!,
        endTime: this.form.value.endTime!
      };

      this.sessionsService.update(this.session!.id, body).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toastr.success('Session updated successfully.');
          this.saved.emit();
          this.close.emit();
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
          this.toastr.error(err.error?.message || 'Failed to update session.');
        }
      });

    }
  }

  cancel(): void {
    this.close.emit();
  }

}