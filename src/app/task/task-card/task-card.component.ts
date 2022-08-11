import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {
  @Input() task;

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    console.log(this.task)
  }

  onViewTask() {

  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date)
  }

}
