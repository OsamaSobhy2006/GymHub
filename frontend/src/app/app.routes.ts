import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Public } from './layouts/public/public';
import { Trainers } from './pages/trainers/trainers';
import { Plans } from './pages/plans/plans';
import { Profile } from './pages/profile/profile';
import { TrainerProfile } from './pages/trainer-profile/trainer-profile';
import { authGuard } from './guards/auth-guard';
import { MyMembership } from './pages/my-membership/my-membership';
import { PaymentSuccess } from './pages/payment-success/payment-success';
import { PaymentCancel } from './pages/payment-cancel/payment-cancel';
import { MySessions } from './pages/session/session';
import { Admin } from './layouts/admin/admin';
import { adminGuard } from './guards/admin-guard';
import { Overview } from './pages/admin-dashboard/overview/overview';
import { Members } from './pages/admin-dashboard/members/members';
import { TrainersDash } from './pages/admin-dashboard/trainers/trainers';
import { MembershipPlans } from './pages/admin-dashboard/membership-plan/membership-plan';
import { Memberships } from './pages/admin-dashboard/memberships/memberships';
import { Sessions } from './pages/admin-dashboard/session/session';
import { Payments } from './pages/admin-dashboard/payment/payment';
import { ReviewDash } from './pages/admin-dashboard/reviews/reviews';
import { Trainer } from './layouts/trainer/trainer';
import { TrainerOverview } from './pages/trainer-dashboard/overview/overview';
import { MySessionsDash } from './pages/trainer-dashboard/my-sessoins/my-sessoins';
import { MyMembers } from './pages/trainer-dashboard/my-members/my-members';
import { TrainerReviews } from './pages/trainer-dashboard/my-reviews/my-reviews';

export const routes: Routes = [
  {
    path: '',
    component: Public,
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
      { path: 'trainers', component: Trainers },
      { path: 'plans', component: Plans },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'profile', component: Profile, canActivate: [authGuard] },
      { path: 'trainers/:id', component: TrainerProfile },
      { path: 'my-membership', component: MyMembership, canActivate: [authGuard] },
      { path: 'payment/success', component: PaymentSuccess, canActivate: [authGuard] },
      { path: 'payment/cancel', component: PaymentCancel, canActivate: [authGuard] },
      { path: 'my-sessions', component: MySessions, canActivate: [authGuard] },
    ],
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: Overview },
      { path: 'members', component: Members },
      { path: 'trainers', component: TrainersDash },
      { path: 'membership-plans', component: MembershipPlans },
      { path: 'memberships', component: Memberships },
      { path: 'sessions', component: Sessions },
      { path: 'payments', component: Payments },
      { path: 'reviews', component: ReviewDash },
    ],
  },
  {path: 'trainer', component: Trainer, children: [
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {path: 'overview', component: TrainerOverview},
    {path: 'my-sessions', component: MySessionsDash},
    {path: 'members', component: MyMembers},
    {path: 'reviews', component: TrainerReviews},
  ]}
];
