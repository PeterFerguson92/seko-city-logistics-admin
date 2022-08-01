/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialDesignModule } from './material-design.module';
import { MaterialButtonComponent } from './buttons/material-button/material-button.component';
import { MaterialPlusButtonComponent } from './buttons/material-plus-button/material-plus-button.component';
import { MaterialDatePickerInputComponent } from './inputs/material-date-picker-input/material-date-picker-input.component';
import { MaterialInputComponent } from './inputs/material-input/material-input.component';
import { MaterialNumericInputComponent } from './inputs/material-numeric-input/material-numeric-input.component';
import { MaterialSelectInputComponent } from './inputs/material-select-input/material-select-input.component';
import { MaterialTextAreaInputComponent } from './inputs/material-text-area-input/material-text-area-input.component';
import { ReportsComponent } from '../reports/reports.component';
import { MaterialSpinnerComponent } from './buttons/material-spinner/material-spinner.component';
import { MaterialTableComponent } from './elements/material-table/material-table.component';
import { SectionTitleComponent } from './elements/section-title/section-title.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { MaterialRadioButtonComponent } from './inputs/material-radio-button/material-radio-button.component';
import { DialogComponent } from './elements/dialog/dialog.component';
import { AlertComponent } from './elements/alert/alert.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialCheckboxComponent } from './inputs/material-checkbox/material-checkbox.component';
import { InputComponent } from './inputs/input/input.component';
import { ConfirmDialogComponent } from './elements/confirm-dialog/confirm-dialog.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JumbotronComponent } from './jumbotron/jumbotron.component';

@NgModule({
  declarations: [MaterialButtonComponent,
    MaterialPlusButtonComponent,
    MaterialDatePickerInputComponent,
    MaterialInputComponent,
    MaterialNumericInputComponent,
    MaterialSelectInputComponent,
    MaterialRadioButtonComponent,
    MaterialTextAreaInputComponent,
    MaterialCheckboxComponent,
    ErrorMessageComponent,
    MaterialSpinnerComponent,
    MaterialTableComponent,
    SectionTitleComponent,
    DialogComponent,
    ConfirmDialogComponent,
    AlertComponent,
    InputComponent,
    JumbotronComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialDesignModule,NgxSpinnerModule ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    MaterialDesignModule,
    NgxSpinnerModule,
    MaterialButtonComponent,
    MaterialPlusButtonComponent,
    MaterialDatePickerInputComponent,
    MaterialInputComponent,
    MaterialNumericInputComponent,
    MaterialSelectInputComponent,
    MaterialRadioButtonComponent,
    MaterialTextAreaInputComponent,
    MaterialCheckboxComponent,
    ErrorMessageComponent,
    MaterialSpinnerComponent,
    MaterialTableComponent,
    SectionTitleComponent,
    AlertComponent,
    InputComponent,
    JumbotronComponent],
    providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    ]
})
export class SharedModule {}
