import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-spinner',
  templateUrl: './material-spinner.component.html',
  styleUrls: ['./material-spinner.component.css']
})
export class MaterialSpinnerComponent implements OnInit {

  @Input() showLoader: boolean;
  @Input() diameter: string;

  constructor() { }

  ngOnInit(): void {
  }
}
