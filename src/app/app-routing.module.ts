import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { FeedbackComponent } from './components/dashboard/feedback/feedback.component';
import { MyBookingsComponent } from './components/dashboard/my-bookings/my-bookings/my-bookings.component';
import { ParkingAreasComponent } from './components/dashboard/parking-areas/parking-areas.component';
import { LoginComponent } from './components/registration/login/login.component';
import { RegistrationComponent } from './components/registration/registration/registration.component';
import { SignUpComponent } from './components/registration/sign-up/sign-up.component';
import { SelectedParkingAreaComponent } from './components/dashboard/selected-parking-area/selected-parking-area.component';
import { AnonymousGuard } from './guards/anonymous/anonymous.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { AdminPanelComponent } from './components/dashboard/admin-panel/admin/admin-panel.component';
import { AdminGuard } from './guards/admin/admin.guard';
import { UserListComponent } from './components/dashboard/admin-panel/user-list/user-list.component';
import { BookingListComponent } from './components/dashboard/admin-panel/booking-list/booking-list.component';
import { FeedbackListComponent } from './components/dashboard/admin-panel/feedback-list/feedback-list.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'parking-area'
      },
      {
        path: 'parking-area',
        component: ParkingAreasComponent,
        children: [
          {
            path: ':id',
            component: SelectedParkingAreaComponent
          }
        ]
      },
      {
        path: 'view-bookings',
        component: MyBookingsComponent
      },
      {
        path: 'feedback',
        component: FeedbackComponent
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        component: AdminPanelComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'all-users'
          },
          {
            path: 'all-users',
            component: UserListComponent,
          },
          {
            path: 'bookings',
            component: BookingListComponent,
          },
          {
            path: 'feedbacks',
            component: FeedbackListComponent,
          },
          {
            path: '**',
            redirectTo: 'all-users'
          },
        ]
      },
    ]
  },
  {
    path: 'auth',
    canActivate: [AnonymousGuard],
    component: RegistrationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignUpComponent
      },
      {
        path: '**',
        redirectTo: 'auth'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
