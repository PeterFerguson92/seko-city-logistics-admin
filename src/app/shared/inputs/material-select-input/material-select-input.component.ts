import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-select-input',
  templateUrl: './material-select-input.component.html',
  styleUrls: ['./material-select-input.component.css']
})
export class MaterialSelectInputComponent implements OnInit {
  @Input() label;
  @Input() options;
  constructor() { }

  ngOnInit(): void {
  }

}
