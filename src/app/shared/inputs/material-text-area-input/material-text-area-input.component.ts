import { Component, HostBinding, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { AbstractControl, ValidationErrors, NgControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { DEFAULT_INPUT_COLOR, ALERT_INPUT_COLOR } from 'src/app/constants';

export interface Validator {
  validate(c: AbstractControl): ValidationErrors | null;
  registerOnValidatorChange?(fn: () => void): void;
}

@Component({
  selector: 'app-material-text-area-input',
  templateUrl: './material-text-area-input.component.html',
  styleUrls: ['./material-text-area-input.component.css']
})
export class MaterialTextAreaInputComponent implements OnInit {
  @Input() placeholder;
  @ViewChild('textarea', { static: true }) public input: MatInput;
  disabled ;
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
  //  this.inputColor = this.controlDir.control.dirty && this.controlDir.invalid ? ALERT_INPUT_COLOR : DEFAULT_INPUT_COLOR
  // return  this.label;
  }

}
