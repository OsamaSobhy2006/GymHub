import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MemebershipPlansService } from '../../services/memebership-plans';
import { MemebershipPlans } from '../../models/memebersip-plans';
import { UsersService } from '../../services/users';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth';
import { Trainer } from '../../models/trainer';
import { Rating } from "../rating/rating";

@Component({
  selector: 'app-home',
  imports: [RouterLink, Rating],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{

  plans = signal<MemebershipPlans[]>([])
  trainers = signal<Trainer[]>([])

  protected environment = environment;

  constructor(
    private membershipPlanService: MemebershipPlansService,
    private usersService: UsersService,
    protected authservice: AuthService
  ){}

  ngOnInit(): void {
      this.membershipPlanService.getAllPlans().subscribe({
        next: (res) => {
          this.plans.set(res.data
            .filter(plan => plan.isActive)
            .sort((a, b) => Number(a.price) - Number(b.price))
            .slice(0, 3)
            )
        },
        error: (error) => {
          console.log(error)
        }
      })

      this.usersService.getAllTrainers().subscribe({
        next: (res) => {
          this.trainers.set(res
            .slice(0, 3)
          )
        },
        error: (error) => {
          console.error(error)
        }
      })
  }
}
