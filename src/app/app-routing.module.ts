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
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'shipments', component: ShipmentsComponent, canActivate: [AuthGuard] },
    { path: 'add-shipment', component: AddEditShipmentComponent, canActivate: [AuthGuard] },
    { path: 'eligible-items', component: EligibleItemsComponent, canActivate: [AuthGuard] },
    { path: 'edit-shipment/:reference', component: AddEditShipmentComponent, canActivate: [AuthGuard] },
    { path: 'shipment-items/:reference', component: ShipmentItemsComponent, canActivate: [AuthGuard] },
    { path: 'shipment-analysis/:reference', component: ShipmentAnalysisComponent, canActivate: [AuthGuard] },
    { path: 'shipment-report/:reference', component: ShipmentReportComponent, canActivate: [AuthGuard] },
    { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard] },
    { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
    { path: 'add-customer', component: CustomerDetailComponent, canActivate: [AuthGuard] },
    { path: 'edit-customer/:reference', component: CustomerDetailComponent, canActivate: [AuthGuard] },
    {
        path: 'customer-history/bookings/:reference',
        component: CustomerBookingHistoryComponent,
        canActivate: [AuthGuard],
        resolve: { bookings: CustomerBookingHistoryResolver },
    },
    { path: 'add-booking', component: AddEditBookingComponent },
    {
        path: 'add-booking/:reference',
        component: AddEditBookingComponent,
        canActivate: [AuthGuard],
        resolve: { customer: CustomerResolver },
    },
    {
        path: 'edit-booking/:reference/:senderReference',
        component: AddEditBookingComponent,
        canActivate: [AuthGuard],
        resolve: { booking: BookingsResolverService },
    },
    {
        path: 'view-booking/:reference/:senderReference',
        component: AddEditBookingComponent,
        canActivate: [AuthGuard],
        resolve: { booking: BookingsResolverService },
    },
    { path: 'booking-summary/:reference', component: BookingSummaryComponent, canActivate: [AuthGuard] },
    { path: 'booking-driver/:reference', component: BookingDriverComponent, canActivate: [AuthGuard] },
    { path: 'drivers', component: DriversComponent, canActivate: [AuthGuard] },
    { path: 'add-driver', component: AddEditDriverComponent, canActivate: [AuthGuard] },
    { path: 'edit-driver/:reference', component: AddEditDriverComponent, canActivate: [AuthGuard] },
    { path: 'assignedBookings/:reference', component: DriverBookingsComponent, canActivate: [AuthGuard] },
    { path: 'assign-bookings', component: AssignMultipleBookingsComponent, canActivate: [AuthGuard] },
    { path: 'assign-orders', component: AssignMultipleOrdersComponent, canActivate: [AuthGuard] },
    { path: 'locations/:reference', component: DriverBookingsLocationsComponent, canActivate: [AuthGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
    { path: 'tasks', component: TaskBoardComponent, canActivate: [AuthGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
    { path: 'add-order', component: AddEditOrderComponent, canActivate: [AuthGuard] },
    {
        path: 'edit-order/:reference/:customerReference',
        component: AddEditOrderComponent,
        canActivate: [AuthGuard],
        resolve: { order: OrderResolver },
    },
    { path: 'add-order/:reference', component: AddEditOrderComponent, resolve: { customer: CustomerResolver }, canActivate: [AuthGuard] },
    { path: 'order-summary/:reference', component: OrderSummaryComponent, canActivate: [AuthGuard] },
    { path: 'planner', component: PlannerCalendarComponent, canActivate: [AuthGuard] },
    { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
