import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-date-picker-input',
  templateUrl: './material-date-picker-input.component.html',
  styleUrls: ['./material-date-picker-input.component.css']
})
export class MaterialDatePickerInputComponent implements OnInit {
  @Input() label;

  constructor() { }

  ngOnInit(): void {
  }

}
