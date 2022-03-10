import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllShipmentsComponent } from './all-shipments/all-shipments.component';
import { AddBookingComponent } from './booking/add-booking/add-booking.component';
import { CustomersComponent } from './customer/customers/customers.component';
import { FindShipmentComponent } from './find-shipment/find-shipment.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-booking/:reference', component: AddBookingComponent },
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
