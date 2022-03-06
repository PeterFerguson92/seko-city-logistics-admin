import { Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { NgControl, ValidatorFn, Validators, AbstractControl, ValidationErrors, ControlValueAccessor } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';

export interface Validator {
  validate(c: AbstractControl): ValidationErrors | null;
  registerOnValidatorChange?(fn: () => void): void;
}

@Component({
  selector: 'app-material-select-input',
  templateUrl: './material-select-input.component.html',
  styleUrls: ['./material-select-input.component.css']
})
export class MaterialSelectInputComponent implements OnInit, ControlValueAccessor, Validator {
  @ViewChild('select', { static: true }) public select: MatSelect;
  disabled;
  @Input() label;
  @Input() value;
  @Input() options
  @Input() modelName: string;
  @Input() controlName: string;

  @Output() selectionChange = new EventEmitter<MatSelectChange>();
  @Output() injectedNgModelChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() type = 'text';
  @Input() isRequired = false;
  @Input() pattern: string = null;
  @Input() placeholder: string;
  @Input()
  get injectedNgModel(): string {
      return this.modelName;
  }

  set injectedNgModel(val: string) {
      this.modelName= val;
      this.injectedNgModelChange.emit(this.modelName);
  }
  constructor(@Optional() public controlDir: NgControl) {
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

  onSelectionChange(event) {
    this.select.value = event.value
    this.selectionChange.next(event);
  }

  writeValue(obj: any): void {
    this.value = obj
    this.select.value = obj;
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

  getErrorMessage() {
    if (this.controlDir.control.hasError('required')) {
      return 'You must enter a value';
    }

    return this.controlDir.hasError('email') ? 'Not a valid email' : '';
  }

}
