import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllShipmentsComponent } from './all-shipments/all-shipments.component';
import { AddEditBookingComponent } from './booking/add-edit-booking/add-edit-booking.component';
import { BookingsComponent } from './booking/bookings/bookings.component';
import { AssignBookingsResolver } from './booking/service/resolver/assign-bookings-resolver';
import { BookingsResolverService } from './booking/service/resolver/bookings-resolver.service';
import { ListBookingsResolver } from './booking/service/resolver/list-bookings.resolver';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { CustomersComponent } from './customer/customers/customers.component';
import { CustomerResolver } from './customer/service/resolver/customer-resolver';
import { FindShipmentComponent } from './find-shipment/find-shipment.component';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';
import { AddEditShipmentComponent } from './shipment/add-edit-shipment/add-edit-shipment.component';
import { AssignBookingsComponent } from './booking/assign-bookings/assign-bookings.component';
import { ListBookingsComponent } from './shipment/list-bookings/list-bookings.component';
import { ShipmentResolver } from './shipment/service/resolver/shipment-resolver';
import { ShipmentsResolverService } from './shipment/service/resolver/shipments-resolver.service';
import { ShipmentsComponent } from './shipment/shipments/shipments.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'shipments', component: ShipmentsComponent, resolve: { shipments: ShipmentsResolverService } },
  { path: 'add-shipment', component: AddEditShipmentComponent },
  { path: 'assign-bookings', component: AssignBookingsComponent, resolve: { info: AssignBookingsResolver }},
  { path: 'edit-shipment/:reference', component: AddEditShipmentComponent, resolve: { shipment: ShipmentResolver  } },
  { path: 'list-bookings/:reference', component: ListBookingsComponent, resolve: { bookings: ListBookingsResolver } },
  { path: 'bookings', component: BookingsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'add-customer', component: CustomerDetailComponent },
  { path: 'edit-customer/:reference', component: CustomerDetailComponent, resolve: { customer: CustomerResolver } },
  { path: 'add-booking', component: AddEditBookingComponent},
  { path: 'add-booking/:reference', component: AddEditBookingComponent, resolve: { customer: CustomerResolver } },
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
