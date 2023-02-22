import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { SideNavComponent } from './side-nav/side-nav.component';
import { CustomerModule } from './customer/customer.module';
import { BookingModule } from './booking/booking.module';
import { ShipmentModule } from './shipment/shipment.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportsComponent } from './reports/reports.component';
import { DriversModule } from './driver/drivers.module';
import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { TaskModule } from './task/task.module';
import { OrdersComponent } from './order/orders/orders.component';
import { UpdateItemsDialogComponent } from './items/update-items-dialog/update-items-dialog.component';
import { ProfileModule } from './profile/profile.module';
import { environment } from 'src/environments/environment';
import { PlannerCalendarComponent } from './planner/planner-calendar/planner-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ReportsComponent,
        SideNavComponent,
        HomeComponent,
        OrdersComponent,
        UpdateItemsDialogComponent,
        PlannerCalendarComponent,
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
        NgxChartsModule,
        CustomerModule,
        BookingModule,
        ShipmentModule,
        DriversModule,
        HomeModule,
        TaskModule,
        ProfileModule,
        FullCalendarModule,
    ],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: (httpLink: HttpLink) => {
                return {
                    cache: new InMemoryCache(),
                    link: httpLink.create({
                        uri: environment.apiUrl,
                    }),
                };
            },
            deps: [HttpLink],
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], // This is new to version 13 as well,
    bootstrap: [AppComponent],
})
export class AppModule {}
