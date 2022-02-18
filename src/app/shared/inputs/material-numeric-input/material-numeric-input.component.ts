import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-numeric-input',
  templateUrl: './material-numeric-input.component.html',
  styleUrls: ['./material-numeric-input.component.css']
})
export class MaterialNumericInputComponent implements OnInit {
  @Input() label;

  constructor() { }

  ngOnInit(): void {
  }

}
