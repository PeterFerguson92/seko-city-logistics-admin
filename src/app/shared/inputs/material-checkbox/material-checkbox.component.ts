import { Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-material-checkbox',
  templateUrl: './material-checkbox.component.html',
  styleUrls: ['./material-checkbox.component.css']
})
export class MaterialCheckboxComponent implements OnInit, ControlValueAccessor {
  @ViewChild('checkbox', { static: true }) public select: MatCheckbox;
  @Input() label;
  @Output() checkBoxChange = new EventEmitter<MatCheckboxChange>();
  @Input() value;
  disabled;

  constructor(@Optional() public controlDir: NgControl) {
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

  onSelectionChange(event) {
    this.select.value = event.value
    this.checkBoxChange.next(event);
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

}
