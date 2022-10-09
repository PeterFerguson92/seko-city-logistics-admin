import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from './models/board.model';
import { Column } from './models/column.model';
import { MatDialog } from '@angular/material/dialog';
import { AddEditTaskDialogComponent } from '../add-edit-task-dialog/add-edit-task-dialog.component';
import { TaskService } from '../service/task.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit, OnDestroy {

  toDoList = [];
  inProgressList = [];
  doneList = [];
  board: Board = new Board('Test Board', [
    new Column('TO DO', this.toDoList),
    new Column('IN PROGRESS', this.inProgressList),
    new Column('DONE', this.doneList),
  ]);
  componentDestroyed$: Subject<boolean> = new Subject();


  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private spinner: NgxSpinnerService,
    private activatedroute: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.taskService.getTasks()
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe({
      next: (result) => {
        if (this.isDataEmpty(result))
        {
          console.log(result);
        } else
        {
          this.arrangeTasks(result.data.tasks);
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.log('error loading tasks')
        console.log(error.message);
        console.log(error);
        this.dialog.open(InfoDialogComponent, {
          height: '25%',
          width: '30%',
          data: { message: error.message }
        });
        this.spinner.hide()
      }
    })
  }

  isDataEmpty(result) {
    return (result === null || result.data === null ||
      result.data.tasks === null) &&  result.data.tasks.length === 0
  }

  arrangeTasks(tasks) {
    for (const task of tasks)
    {
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

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

}
