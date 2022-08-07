import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-button',
  templateUrl: './material-button.component.html',
  styleUrls: ['./material-button.component.css']
})
export class MaterialButtonComponent implements OnInit {

  @Input() label;
  @Input() width;
  @Input() disabled;

  constructor() { }

  ngOnInit(): void {

  }

}
