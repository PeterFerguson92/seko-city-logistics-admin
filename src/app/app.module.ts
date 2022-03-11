import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
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
import { FindShipmentComponent } from './find-shipment/find-shipment.component';
import { AllShipmentsComponent } from './all-shipments/all-shipments.component';
import { AddShippmentConfirmationComponent } from './add-shippment-confirmation/add-shippment-confirmation.component';
import { CustomerModule } from './customer/customer.module';
import { BookingModule } from './booking/booking.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SideNavComponent,
    AddShipmentComponent,
    FindShipmentComponent,
    AllShipmentsComponent,
    AddShippmentConfirmationComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FlexLayoutModule,
    HttpClientModule,
    ApolloModule,
    CustomerModule,
    BookingModule
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
