import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { MaterialDesignModule } from './shared/material-design.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { MaterialButtonComponent } from './shared/inputs/material-button/material-button.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialDesignModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
