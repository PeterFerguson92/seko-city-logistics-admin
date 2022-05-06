import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditBookingComponent } from './booking/add-edit-booking/add-edit-booking.component';
import { BookingsComponent } from './booking/bookings/bookings.component';
import { BookingsResolverService } from './booking/service/resolver/bookings-resolver.service';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { CustomersComponent } from './customer/customers/customers.component';
import { CustomerResolver } from './customer/service/resolver/customer-resolver';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';
import { AddEditShipmentComponent } from './shipment/add-edit-shipment/add-edit-shipment.component';
import { AssignBookingsComponent } from './booking/assign-bookings/assign-bookings.component';
import { ShipmentResolver } from './shipment/service/resolver/shipment.resolver';
import { ShipmentsResolverService } from './shipment/service/resolver/shipments.resolver.service';
import { ShipmentsComponent } from './shipment/shipments/shipments.component';
import { BookingSummaryComponent } from './booking/booking-summary/booking-summary.component';
import { BookingSummaryResolver } from './booking/service/resolver/booking-summary.resolver';
import { ListItemsComponent } from './shipment/list-items/list-items.component';
import { ShipmentItemsResolver } from './shipment/service/resolver/shipment-items.resolver';
import { DriversComponent } from './drivers/drivers/drivers.component';
import { HomeComponent } from './home/home.component';
import { AssignItemsResolver } from './shipment/service/resolver/assign-items.resolver';
import { AssignItemsComponent } from './shipment/assign-items/assign-items.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shipments', component: ShipmentsComponent, resolve: { shipments: ShipmentsResolverService } },
  { path: 'add-shipment', component: AddEditShipmentComponent },
  { path: 'assign-items', component: AssignItemsComponent, resolve: { info: AssignItemsResolver }},
  { path: 'edit-shipment/:reference', component: AddEditShipmentComponent, resolve: { shipment: ShipmentResolver  } },
  { path: 'list-items/:reference', component: ListItemsComponent, resolve: { items: ShipmentItemsResolver } },
  { path: 'bookings', component: BookingsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'add-customer', component: CustomerDetailComponent },
  { path: 'edit-customer/:reference', component: CustomerDetailComponent, resolve: { customer: CustomerResolver } },
  { path: 'add-booking', component: AddEditBookingComponent},
  { path: 'add-booking/:reference', component: AddEditBookingComponent, resolve: { customer: CustomerResolver } },
  { path: 'edit-booking/:reference/:senderReference', component: AddEditBookingComponent, resolve: { booking: BookingsResolverService } },
  { path: 'view-booking/:reference/:senderReference', component: AddEditBookingComponent, resolve: { booking: BookingsResolverService } },
  { path: 'booking-summary/:reference', component: BookingSummaryComponent, resolve: { booking: BookingSummaryResolver } },
  { path: 'reports', component: ReportsComponent },
  { path: 'drivers', component: DriversComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
