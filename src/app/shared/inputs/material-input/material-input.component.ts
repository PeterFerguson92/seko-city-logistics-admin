import { Component, ElementRef, forwardRef, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, NgControl,
  NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn, Validators
} from '@angular/forms';
import { MatInput } from '@angular/material/input';

export interface Validator {
  validate(c: AbstractControl): ValidationErrors | null;
  registerOnValidatorChange?(fn: () => void): void;
}

@Component({
  selector: 'app-material-input',
  templateUrl: './material-input.component.html',
  styleUrls: ['./material-input.component.css'],
  // providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MaterialInputComponent), multi: true } ]


  // providers: [{
  //   provide: NG_VALUE_ACCESSOR,
  //   multi: true,
  //   useExisting: MaterialInputComponent
  // },{
  //   provide: NG_VALIDATORS,
  //   useExisting: MaterialInputComponent,
  //   multi: true
  // }]
})
export class MaterialInputComponent implements OnInit, ControlValueAccessor, Validator {
  @ViewChild('input', { static: true }) public input: MatInput;
  disabled;

  @Input() label;
  @Input() icon;
  @Input() width;

  @Input() type = 'text';
  @Input() isRequired = false;
  @Input() pattern: string = null;
  @Input() placeholder: string;
  @Input() errorMsg: string;


  constructor(@Optional() @Optional() public controlDir: NgControl) {
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.controlDir)
    {
      const control = this.controlDir.control;
      const validators: ValidatorFn[] = control.validator ? [control.validator] : [];
      if (this.isRequired)
      {
        validators.push(Validators.required);
      }
      if (this.pattern)
      {
        validators.push(Validators.pattern(this.pattern));
      }

      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }

  writeValue(obj: any): void {
   this.input.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  onChange(event) { }

  onTouched() { }

  validate(c: AbstractControl): ValidationErrors {
    const validators: ValidatorFn[] = [];
    if (this.isRequired) {
      validators.push(Validators.required);
    }
    if (this.pattern) {
      validators.push(Validators.pattern(this.pattern));
    }

    return validators;
  }


}
