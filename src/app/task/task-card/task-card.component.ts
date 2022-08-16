import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/service/common.service';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { AddEditTaskDialogComponent } from '../add-edit-task-dialog/add-edit-task-dialog.component';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {
  @Input() task;

  constructor(private commonService: CommonService, private taskService: TaskService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onViewTask() {
    const dialogRef = this.dialog.open(AddEditTaskDialogComponent, {
      // height: '70%',
      width: '40%',
      data: { task: this.task }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  OnDeleteTask(id) {
    const dialogRef = this.dialog.open(DialogComponent);
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

}
