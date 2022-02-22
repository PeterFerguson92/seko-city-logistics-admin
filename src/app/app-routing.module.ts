import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { AllShipmentsComponent } from './all-shipments/all-shipments.component';
import { FindShipmentComponent } from './find-shipment/find-shipment.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-shipment', component: AddShipmentComponent },
  { path: 'add-customer', component: AddCustomerComponent },
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
