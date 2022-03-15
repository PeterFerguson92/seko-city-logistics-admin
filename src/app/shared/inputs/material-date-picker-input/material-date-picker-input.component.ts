import { Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-material-date-picker-input',
  templateUrl: './material-date-picker-input.component.html',
  styleUrls: ['./material-date-picker-input.component.css']
})
export class MaterialDatePickerInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) public input: MatInput;
  @Input() label;
  @Output() inputChange = new EventEmitter<MatInput>();

  value;
  disabled;

  constructor(@Optional() public controlDir: NgControl, ) {
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.controlDir)
    {
      const control = this.controlDir.control;
      control.updateValueAndValidity();
    }
  }

  writeValue(obj: any): void {
    this.value = obj
    // this.input.value = obj;
  }

  onInputChange(event) {
    this.inputChange.next(event);
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

  onTouched() {}

}
