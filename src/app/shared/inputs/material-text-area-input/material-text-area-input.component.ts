import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-text-area-input',
  templateUrl: './material-text-area-input.component.html',
  styleUrls: ['./material-text-area-input.component.css']
})
export class MaterialTextAreaInputComponent implements OnInit {
  @Input() placeholder;

  constructor() { }

  ngOnInit(): void {
  }

}
