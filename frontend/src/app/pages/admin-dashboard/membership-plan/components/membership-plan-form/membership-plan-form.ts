import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MemebershipPlansService } from '../../../../../services/memebership-plans';
import { MemebershipPlans } from '../../../../../models/memebersip-plans';

import {
  CreateMembershipPlanRequest,
  UpdateMembershipPlanRequest,
} from '../../../../../models/membership-plan-request';

@Component({
  selector: 'app-membership-plan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './membership-plan-form.html',
  styleUrl: './membership-plan-form.css',
})
export class MembershipPlanFormComponent implements OnChanges {

  private readonly fb = inject(FormBuilder);
  private readonly plansService = inject(MemebershipPlansService);

  @Input()
  plan: MemebershipPlans | null = null;

  @Output()
  close = new EventEmitter<void>();

  @Output()
  saved = new EventEmitter<void>();

  isLoading = signal(false);

  form = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
      ],
    ],

    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
      ],
    ],

    price: [
      0,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],

    durationInDays: [
      30,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],

  });

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['plan']) {

      if (this.plan) {

        this.form.patchValue({

          name: this.plan.name,

          description: this.plan.description,

          price: this.plan.price,

          durationInDays: this.plan.durationInDays,

        });

      } else {

        this.form.reset({

          name: '',

          description: '',

          price: 0,

          durationInDays: 30,

        });

      }

    }

  }

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.isLoading.set(true);

    if (!this.plan) {

      const body: CreateMembershipPlanRequest = {

        name: this.form.value.name!,

        description: this.form.value.description!,

        price: Number(this.form.value.price),

        durationInDays: Number(this.form.value.durationInDays),

      };

      this.plansService.create(body).subscribe({

        next: () => {

          this.isLoading.set(false);

          this.saved.emit();

          this.close.emit();

        },

        error: (err) => {

          console.error(err);

          this.isLoading.set(false);

        },

      });

      return;

    }

    const body: UpdateMembershipPlanRequest = {

      name: this.form.value.name!,

      description: this.form.value.description!,

      price: Number(this.form.value.price),

      durationInDays: Number(this.form.value.durationInDays),

    };

    this.plansService.update(this.plan.id, body).subscribe({

      next: () => {

        this.isLoading.set(false);

        this.saved.emit();

        this.close.emit();

      },

      error: (err) => {

        console.error(err);

        this.isLoading.set(false);

      },

    });

  }

  cancel(): void {

    this.close.emit();

  }

}