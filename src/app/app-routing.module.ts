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
import { ShipmentResolver } from './shipment/service/resolver/shipment.resolver';
import { ShipmentsResolverService } from './shipment/service/resolver/shipments.resolver.service';
import { ShipmentsComponent } from './shipment/shipments/shipments.component';
import { BookingSummaryComponent } from './booking/booking-summary/booking-summary.component';
import { BookingSummaryResolver } from './booking/service/resolver/booking-summary.resolver';
import { ShipmentItemsResolver } from './shipment/service/resolver/shipment-items.resolver';
import { DriversComponent } from './driver/drivers/drivers.component';
import { HomeComponent } from './home/home.component';
import { LoadedItemsResolver } from './shipment/service/resolver/loaded-items.resolver';
import { ShipmentItemsComponent } from './shipment/shipment-items/shipment-items.component';
import { ShipmentAnalysisComponent } from './shipment/shipment-analysis/shipment-analysis.component';
import { ShipmentReportComponent } from './shipment/shipment-report/shipment-report.component';
import { AddEditDriverComponent } from './driver/add-edit-driver/add-edit-driver.component';
import { DriverResolver } from './driver/service/driver.resolver';
import { DriversResolver } from './driver/service/drivers.resolver';
import { DriverBookingsResolver } from './booking/service/resolver/driver-bookings.resolver';
import { DriverBookingsComponent } from './driver/driver-bookings/driver-bookings.component';
import { DriverBookingsLocationsComponent } from './driver/driver-bookings-locations/driver-bookings-locations.component';
import { LoadedItemsComponent } from './shipment/loaded-items/loaded-items.component';
import { TasksResolver } from './task/service/resolver/tasks.resolver';
import { TaskBoardComponent } from './task/task-board/task-board.component';
import { OrdersComponent } from './order/orders/orders.component';
import { OrdersResolver } from './order/service/resolver/orders.resolver';
import { AddEditOrderComponent } from './order/add-edit-order/add-edit-order.component';
import { OrderResolver } from './order/service/resolver/order.resolver';
import { CustomerBookingHistoryComponent } from './customer/customer-booking-history/customer-booking-history.component';
import { CustomerBookingHistoryResolver } from './customer/service/resolver/customer-booking-history.resolver';
import { ProfileComponent } from './profile/profile/profile.component';
import { AuthGuard } from './shared/authentication/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shipments', component: ShipmentsComponent, resolve: { shipments: ShipmentsResolverService } },
  { path: 'add-shipment', component: AddEditShipmentComponent },
  { path: 'loaded-items', component: LoadedItemsComponent, resolve: { info: LoadedItemsResolver }},
  { path: 'edit-shipment/:reference', component: AddEditShipmentComponent, resolve: { shipment: ShipmentResolver  } },
  { path: 'shipment-items/:reference', component: ShipmentItemsComponent, resolve: { items: ShipmentItemsResolver } },
  { path: 'shipment-analysis/:reference', component: ShipmentAnalysisComponent, resolve: { shipment: ShipmentResolver } },
  { path: 'shipment-report/:reference', component: ShipmentReportComponent, resolve: { shipment: ShipmentResolver  } },
  { path: 'bookings', component: BookingsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'add-customer', component: CustomerDetailComponent },
  { path: 'edit-customer/:reference', component: CustomerDetailComponent, resolve: { customer: CustomerResolver } },
  {
    path: 'customer-history/bookings/:reference', component: CustomerBookingHistoryComponent,
    resolve: { bookings: CustomerBookingHistoryResolver }
  },
  { path: 'add-booking', component: AddEditBookingComponent },
  { path: 'add-booking/:reference', component: AddEditBookingComponent, resolve: { customer: CustomerResolver } },
  { path: 'edit-booking/:reference/:senderReference', component: AddEditBookingComponent, resolve: { booking: BookingsResolverService } },
  { path: 'view-booking/:reference/:senderReference', component: AddEditBookingComponent, resolve: { booking: BookingsResolverService } },
  { path: 'booking-summary/:reference', component: BookingSummaryComponent, resolve: { booking: BookingSummaryResolver } },
  { path: 'drivers', component: DriversComponent, resolve: { drivers: DriversResolver } },
  { path: 'add-driver', component: AddEditDriverComponent },
  { path: 'edit-driver/:reference', component: AddEditDriverComponent, resolve: { driver: DriverResolver } },
  { path: 'assignedBookings/:reference', component: DriverBookingsComponent, resolve: { bookings: DriverBookingsResolver } },
  { path: 'locations/:reference', component: DriverBookingsLocationsComponent, resolve: { bookings: DriverBookingsResolver } },
  { path: 'reports', component: ReportsComponent },
  { path: 'tasks', component: TaskBoardComponent, resolve: { tasks: TasksResolver } },
  { path: 'orders', component: OrdersComponent, resolve: { orders: OrdersResolver } },
  { path: 'add-order', component: AddEditOrderComponent },
  { path: 'edit-order/:reference/:customerReference', component: AddEditOrderComponent, resolve: { order: OrderResolver } },
  { path: 'add-order/:reference', component: AddEditOrderComponent, resolve: { customer: CustomerResolver } },
  { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
