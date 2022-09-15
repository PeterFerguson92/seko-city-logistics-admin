import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from './models/board.model';
import { Column } from './models/column.model';
import { MatDialog } from '@angular/material/dialog';
import { AddEditTaskDialogComponent } from '../add-edit-task-dialog/add-edit-task-dialog.component';
import { TaskService } from '../service/task.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit {

  toDoList = [];
  inProgressList = [];
  doneList = [];
  board: Board = new Board('Test Board', [
    new Column('TO DO', this.toDoList),
    new Column('IN PROGRESS', this.inProgressList),
    new Column('DONE', this.doneList),
  ]);

  constructor(private activatedroute: ActivatedRoute, private dialog: MatDialog,
    private taskService: TaskService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.arrangeTasks(data.tasks)
    })
  }

  arrangeTasks(tasks) {
    for (const task of tasks)
      if ('TO DO' === task.status)
      {
        this.toDoList.push(task)
      } else
      {
        if ('IN PROGRESS' === task.status)
        {
          this.inProgressList.push(task)
        } else
        {
        if ('DONE' === task.status)
        {
          this.doneList.push(task)
        }
      }
    }
  }

  isTaskApproaching(taskActionDate) {
    const myCurrentDate = new Date();
    const taskDate = new Date(taskActionDate)
    myCurrentDate.setHours(0, 0, 0, 0);

    const myPastDate = new Date(myCurrentDate);
    myPastDate.setDate(myPastDate.getDate() + 2);
    const dayDiff = taskDate.getDate() - myPastDate.getDate();
    // console.log(dayDiff)
    return dayDiff <= 3;
  }

  drop(event: CdkDragDrop<string[]>, columnName) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    const taskId = (JSON.parse(JSON.stringify(event.container.data[0])).id)
    this.updateTask(taskId, columnName)
  }

  updateTask(taskId, status) {
    const updateFields = [{ name: 'status', value: status }]

    if (updateFields.length > 0)
    {
      this.taskService.updateTask(taskId, updateFields).subscribe(
        ({ data }) => {
         window.location.reload()
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  onAddTask() {
    const dialogRef = this.dialog.open(AddEditTaskDialogComponent, {
      height: '65%',
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }


}
