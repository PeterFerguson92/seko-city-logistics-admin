import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-input',
  templateUrl: './material-input.component.html',
  styleUrls: ['./material-input.component.css']
})
export class MaterialInputComponent implements OnInit {
  @Input() label;
  @Input() icon;

  constructor() { }

  ngOnInit(): void {
  }

}
