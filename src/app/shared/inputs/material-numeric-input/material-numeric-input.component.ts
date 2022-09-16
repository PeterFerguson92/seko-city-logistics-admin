import { Component, EventEmitter, HostBinding, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { DEFAULT_INPUT_COLOR, ALERT_INPUT_COLOR } from 'src/app/constants';

@Component({
  selector: 'app-material-numeric-input',
  templateUrl: './material-numeric-input.component.html',
  styleUrls: ['./material-numeric-input.component.css']
})
export class MaterialNumericInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) public input: MatInput;

  @Input() label;
  @Input() icon;
  @Input() width;
  @Input() errorMsg: string;
  @Input() type;
  @Input() max;
  @Input() disabled ;
  @Output() inputChange = new EventEmitter<MatInput>();
  value;

  inputColor;

  @HostBinding('attr.style')
  public get valueAsStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`--input-color: ${this.inputColor}`);
  }
  constructor(@Optional() public controlDir: NgControl, private sanitizer: DomSanitizer) {
    this.inputColor = DEFAULT_INPUT_COLOR
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


  getDisplayLabel() {
   this.inputColor = this.controlDir.control.dirty && this.controlDir.invalid ? ALERT_INPUT_COLOR : DEFAULT_INPUT_COLOR
  return  this.label;
  }

}
