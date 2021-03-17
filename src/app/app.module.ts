import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SignUpComponent } from './components/registration/sign-up/sign-up.component';
import { LoginComponent } from './components/registration/login/login.component';
import { RegistrationComponent } from './components/registration/registration/registration.component';
import { HeaderComponent } from './components/header/header.component';
import { ParkingAreasComponent } from './components/dashboard/parking-areas/parking-areas.component';
import { SelectedParkingAreaComponent } from './components/dashboard/selected-parking-area/selected-parking-area.component';
import { ParkingSpacesComponent } from './components/dashboard/parking-spaces/parking-spaces.component';
import { FeedbackComponent } from './components/dashboard/feedback/feedback.component';
import { MyBookingsComponent } from './components/dashboard/my-bookings/my-bookings/my-bookings.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { BookingsTableComponent } from './components/dashboard/my-bookings/bookings-table/bookings-table.component';
import { AdminPanelComponent } from './components/dashboard/admin-panel/admin/admin-panel.component';
import { UserListComponent } from './components/dashboard/admin-panel/user-list/user-list.component';
import { BookingListComponent } from './components/dashboard/admin-panel/booking-list/booking-list.component';
import { FeedbackListComponent } from './components/dashboard/admin-panel/feedback-list/feedback-list.component';
import { FeedbackListTableComponent } from './components/dashboard/admin-panel/feedback-list/feedback-list-table/feedback-list-table.component';
import { BookingListTableComponent } from './components/dashboard/admin-panel/booking-list/booking-list-table/booking-list-table.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    RegistrationComponent,
    HeaderComponent,
    ParkingAreasComponent,
    SelectedParkingAreaComponent,
    ParkingSpacesComponent,
    FeedbackComponent,
    MyBookingsComponent,
    DashboardComponent,
    BookingsTableComponent,
    AdminPanelComponent,
    UserListComponent,
    BookingListComponent,
    FeedbackListComponent,
    FeedbackListTableComponent,
    BookingListTableComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
