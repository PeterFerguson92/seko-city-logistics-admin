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
import { ShipmentsComponent } from './shipment/shipments/shipments.component';
import { BookingSummaryComponent } from './booking/booking-summary/booking-summary.component';
import { DriversComponent } from './driver/drivers/drivers.component';
import { HomeComponent } from './home/home.component';
import { ShipmentItemsComponent } from './shipment/shipment-items/shipment-items.component';
import { ShipmentAnalysisComponent } from './shipment/shipment-analysis/shipment-analysis.component';
import { ShipmentReportComponent } from './shipment/shipment-report/shipment-report.component';
import { AddEditDriverComponent } from './driver/add-edit-driver/add-edit-driver.component';
import { DriverBookingsComponent } from './driver/driver-bookings/driver-bookings.component';
import { DriverBookingsLocationsComponent } from './driver/driver-bookings-locations/driver-bookings-locations.component';
import { TaskBoardComponent } from './task/task-board/task-board.component';
import { OrdersComponent } from './order/orders/orders.component';
import { AddEditOrderComponent } from './order/add-edit-order/add-edit-order.component';
import { CustomerBookingHistoryComponent } from './customer/customer-booking-history/customer-booking-history.component';
import { CustomerBookingHistoryResolver } from './customer/service/resolver/customer-booking-history.resolver';
import { ProfileComponent } from './profile/profile/profile.component';
import { AuthGuard } from './shared/authentication/auth.guard';
import { EligibleItemsComponent } from './shipment/eligible-items/eligible-items.component';
import { BookingDriverComponent } from './booking/booking-driver/booking-driver.component';
import { AssignMultipleBookingsComponent } from './driver/assign-multiple-bookings/assign-multiple-bookings.component';
import { AssignMultipleOrdersComponent } from './driver/assign-multiple-orders/assign-multiple-orders.component';
import { OrderSummaryComponent } from './order/order-summary/order-summary.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { OrderResolver } from './order/service/order.resolver';
import { PlannerCalendarComponent } from './planner/planner-calendar/planner-calendar.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'shipments', component: ShipmentsComponent },
    { path: 'add-shipment', component: AddEditShipmentComponent },
    { path: 'eligible-items', component: EligibleItemsComponent },
    { path: 'edit-shipment/:reference', component: AddEditShipmentComponent },
    { path: 'shipment-items/:reference', component: ShipmentItemsComponent },
    { path: 'shipment-analysis/:reference', component: ShipmentAnalysisComponent },
    { path: 'shipment-report/:reference', component: ShipmentReportComponent },
    { path: 'bookings', component: BookingsComponent },
    { path: 'customers', component: CustomersComponent },
    { path: 'add-customer', component: CustomerDetailComponent },
    { path: 'edit-customer/:reference', component: CustomerDetailComponent },
    {
        path: 'customer-history/bookings/:reference',
        component: CustomerBookingHistoryComponent,
        resolve: { bookings: CustomerBookingHistoryResolver },
    },
    { path: 'add-booking', component: AddEditBookingComponent },
    {
        path: 'add-booking/:reference',
        component: AddEditBookingComponent,
        resolve: { customer: CustomerResolver },
    },
    {
        path: 'edit-booking/:reference/:senderReference',
        component: AddEditBookingComponent,
        resolve: { booking: BookingsResolverService },
    },
    {
        path: 'view-booking/:reference/:senderReference',
        component: AddEditBookingComponent,
        resolve: { booking: BookingsResolverService },
    },
    { path: 'booking-summary/:reference', component: BookingSummaryComponent },
    { path: 'booking-driver/:reference', component: BookingDriverComponent },
    { path: 'drivers', component: DriversComponent },
    { path: 'add-driver', component: AddEditDriverComponent },
    { path: 'edit-driver/:reference', component: AddEditDriverComponent },
    { path: 'assignedBookings/:reference', component: DriverBookingsComponent },
    { path: 'assign-bookings', component: AssignMultipleBookingsComponent },
    { path: 'assign-orders', component: AssignMultipleOrdersComponent },
    { path: 'locations/:reference', component: DriverBookingsLocationsComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'tasks', component: TaskBoardComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'add-order', component: AddEditOrderComponent },
    {
        path: 'edit-order/:reference/:customerReference',
        component: AddEditOrderComponent,
        resolve: { order: OrderResolver },
    },
    { path: 'add-order/:reference', component: AddEditOrderComponent, resolve: { customer: CustomerResolver } },
    { path: 'order-summary/:reference', component: OrderSummaryComponent },
    { path: 'planner', component: PlannerCalendarComponent },
    { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
