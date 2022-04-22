import { Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css', '../../shared-form.css']
})
export class InputComponent implements OnInit {
  @ViewChild('input', { static: true }) public input: any;

  @Input() label;
  @Input() placeholder;
  @Input() name;
  disabled ;
  value;
  inputColor;
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

  onTouched() {}

}
