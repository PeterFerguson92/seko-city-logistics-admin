import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  onFirstComponentButtonClick() {
    console.log('In the service');
    this.invokeFirstComponentFunction.emit();
  }

  onEnable() {
    console.log('In the service2');
    this.invokeFirstComponentFunction.emit();
  }


}
