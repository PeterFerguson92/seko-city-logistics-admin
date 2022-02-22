import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-material-select-input',
  templateUrl: './material-select-input.component.html',
  styleUrls: ['./material-select-input.component.css']
})
export class MaterialSelectInputComponent implements OnInit {
  @Input() label;
  @Input() options;
  @Input() modelName: string;
  @Output() injectedNgModelChange: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  get injectedNgModel(): string {
      return this.modelName;
  }

  set injectedNgModel(val: string) {
      this.modelName= val;
      this.injectedNgModelChange.emit(this.modelName);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
