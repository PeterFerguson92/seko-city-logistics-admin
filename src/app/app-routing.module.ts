import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllShipmentsComponent } from './all-shipments/all-shipments.component';
import { AddEditBookingComponent } from './booking/add-edit-booking/add-edit-booking.component';
import { BookingsComponent } from './booking/bookings/bookings.component';
import { AssignBookingsResolverService } from './booking/service/resolver/assign-bookings-resolver.service';
import { BookingsResolverService } from './booking/service/resolver/bookings-resolver.service';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { CustomersComponent } from './customer/customers/customers.component';
import { CustomerResolverService } from './customer/service/resolver/customer-resolver.service';
import { FindShipmentComponent } from './find-shipment/find-shipment.component';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';
import { AddShipmentComponent } from './shipment/add-shipment/add-shipment.component';
import { AssignBookingsComponent } from './shipment/assign-bookings/assign-bookings.component';
import { ShipmentsResolverService } from './shipment/service/resolver/shipment-resolver.service';
import { ShipmentsComponent } from './shipment/shipments/shipments.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'shipments', component: ShipmentsComponent, resolve: { shipments: ShipmentsResolverService } },
  { path: 'add-shipments', component: AddShipmentComponent },
  { path: 'assign-bookings/:reference', component: AssignBookingsComponent, resolve: { bookings: AssignBookingsResolverService }},
  { path: 'bookings', component: BookingsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'add-customer', component: CustomerDetailComponent },
  { path: 'edit-customer/:reference', component: CustomerDetailComponent, resolve: { customer: CustomerResolverService } },
  { path: 'add-booking/:reference', component: AddEditBookingComponent, resolve: { customer: CustomerResolverService } },
  { path: 'edit-booking/:reference/:senderReference', component: AddEditBookingComponent, resolve: { booking: BookingsResolverService } },
  { path: 'view-booking/:reference/:senderReference', component: AddEditBookingComponent, resolve: {booking: BookingsResolverService} },
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
