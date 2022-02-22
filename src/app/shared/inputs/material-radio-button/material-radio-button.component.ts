import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-radio-button',
  templateUrl: './material-radio-button.component.html',
  styleUrls: ['./material-radio-button.component.css']
})
export class MaterialRadioButtonComponent implements OnInit {
  @Input() options;

  constructor() { }

  ngOnInit(): void {
  }

}
