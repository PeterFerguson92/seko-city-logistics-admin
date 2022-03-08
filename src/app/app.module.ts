import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { MaterialDesignModule } from './shared/material-design.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InMemoryCache } from '@apollo/client/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { MaterialInputComponent } from './shared/inputs/material-input/material-input.component';
import { MaterialSelectInputComponent } from './shared/inputs/material-select-input/material-select-input.component';
import { MaterialDatePickerInputComponent } from './shared/inputs/material-date-picker-input/material-date-picker-input.component';
import { MaterialTextAreaInputComponent } from './shared/inputs/material-text-area-input/material-text-area-input.component';
import { MaterialNumericInputComponent } from './shared/inputs/material-numeric-input/material-numeric-input.component';
import { MaterialPlusButtonComponent } from './shared/buttons/material-plus-button/material-plus-button.component';
import { MaterialButtonComponent } from './shared/buttons/material-button/material-button.component';
import { FindShipmentComponent } from './find-shipment/find-shipment.component';
import { AllShipmentsComponent } from './all-shipments/all-shipments.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { AddShippmentConfirmationComponent } from './add-shippment-confirmation/add-shippment-confirmation.component';
import { MaterialRadioButtonComponent } from './shared/inputs/material-radio-button/material-radio-button.component';
import { ReportsComponent } from './reports/reports.component';
import { ErrorMessageComponent } from './shared/error-message/error-message.component';
import { MaterialSpinnerComponent } from './shared/buttons/material-spinner/material-spinner.component';
import { CustomersComponent } from './customer/customers/customers.component';
import { MaterialTableComponent } from './shared/elements/material-table/material-table.component';
import { SectionTitleComponent } from './shared/elements/section-title/section-title.component';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { DialogComponent } from './shared/elements/dialog/dialog.component';
import { AddEditCustomerDialogComponent } from './customer/add-edit-customer-dialog/add-edit-customer-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SideNavComponent,
    AddShipmentComponent,
    MaterialInputComponent,
    MaterialSelectInputComponent,
    MaterialDatePickerInputComponent,
    MaterialTextAreaInputComponent,
    MaterialNumericInputComponent,
    MaterialPlusButtonComponent,
    MaterialButtonComponent,
    FindShipmentComponent,
    AllShipmentsComponent,
    AddCustomerComponent,
    AddShippmentConfirmationComponent,
    MaterialRadioButtonComponent,
    ReportsComponent,
    ErrorMessageComponent,
    MaterialSpinnerComponent,
    CustomersComponent,
    MaterialTableComponent,
    SectionTitleComponent,
    CustomerDetailComponent,
    DialogComponent,
    AddEditCustomerDialogComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialDesignModule,
    FlexLayoutModule,
    HttpClientModule,
    ApolloModule
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: 'http://localhost:4000/api'
          // uri: 'https://seko-server.herokuapp.com/api'

        })
      }
    },
    deps: [HttpLink]
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
