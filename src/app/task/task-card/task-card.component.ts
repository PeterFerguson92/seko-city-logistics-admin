import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WEB_TASK_PICK_UP_REQUEST } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ConfirmDialogComponent } from 'src/app/shared/elements/confirm-dialog/confirm-dialog.component';
import { AddEditTaskDialogComponent } from '../add-edit-task-dialog/add-edit-task-dialog.component';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {
  @Input() task;

  constructor(private commonService: CommonService,
    private taskService: TaskService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onViewTask() {
    const dialogRef = this.dialog.open(AddEditTaskDialogComponent, {
      height: '65%',
      width: '50%',
      data: { task: this.task }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  OnDeleteTask(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
        this.taskService.deleteTask(id).subscribe(
          ({ data }) => {
            location.reload()
          },
          error => {
            console.log(error);
          }
        )
      }
    })
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date)
  }

  isWebPickUp(task) {
    return task.title === WEB_TASK_PICK_UP_REQUEST;
  }

  getDisplayText(task) {
    if (this.isWebPickUp(task))
    {
      const info = task.description.split('-');
      return info
    } else
    {
      return task.description;
    }
  }

  getTaskClass(task) {
    const today = new Date(new Date()).toISOString();
    const todayNewDate = new Date(this.commonService.getFormattedDate(today).split('/').reverse().join('/'));
    const taskDueDate = new Date(this.commonService.getFormattedDate(task.actionDate).split('/').reverse().join('/'));

    if (todayNewDate  >
      taskDueDate && task.status !== 'DONE')
    {
      return { pastDueDate:true }
    }

    if (this.commonService.getFormattedDate(today) ===
      this.commonService.getFormattedDate(task.actionDate) && task.status !== 'DONE')
    {
      return { currentDueDate:true }
    }
  }

}
