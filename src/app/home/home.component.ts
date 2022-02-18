import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { EventEmitterService } from '../shared/service/event/event-emitter.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebar') sidebar;

  constructor(private eventEmitterService: EventEmitterService ) { }
  ngAfterViewInit(): void {
    // console.log(this.eventEmitterService.subsVar);
    // if (this.eventEmitterService.subsVar === undefined) {
    //   this.eventEmitterService.subsVar = this.eventEmitterService.
    //   invokeFirstComponentFunction.subscribe((name:string) => {
    //     this.openMenu();
    //   });
    // }
  }

  ngOnInit() {
    this.firstComponentFunction()

  }

  firstComponentFunction(){
    this.eventEmitterService.onEnable();
  }

  openMenu() {
    console.log('2222222222')
    this.sidebar.toggle()
  }

  firstFunction() {
    console.log('333333')

    alert( 'Hello ' + '\nWelcome to C# Corner \nFunction in First Component');
  }
}
