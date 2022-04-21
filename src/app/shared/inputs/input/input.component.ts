import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css', '../../shared-form.css']
})
export class InputComponent implements OnInit {
  @Input() label;
  @Input() placeholder;
  @Input() name;
  constructor() { }

  ngOnInit(): void {
  }

}
