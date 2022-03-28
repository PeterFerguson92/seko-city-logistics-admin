import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllShipmentsComponent } from './all-shipments/all-shipments.component';
import { AddEditBookingComponent } from './booking/add-edit-booking/add-edit-booking.component';
import { BookingsComponent } from './booking/bookings/bookings.component';
import { BookingsResolverService } from './booking/service/resolver/bookings-resolver.service';
import { CustomersComponent } from './customer/customers/customers.component';
import { CustomerResolverService } from './customer/service/resolver/customer-resolver.service';
import { FindShipmentComponent } from './find-shipment/find-shipment.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-booking/:reference', component: AddEditBookingComponent, resolve: { customer: CustomerResolverService } },
  { path: 'edit-booking/:reference', component: AddEditBookingComponent, resolve: {booking: BookingsResolverService} },
  { path: 'find-shipment', component: FindShipmentComponent },
  { path: 'all-shipments', component: AllShipmentsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
