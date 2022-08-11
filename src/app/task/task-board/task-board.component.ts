import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from './models/board.model';
import { Column } from './models/column.model';
import { MatDialog } from '@angular/material/dialog';
import { AddEditTaskDialogComponent } from '../add-edit-task-dialog/add-edit-task-dialog.component';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit {

  toDoList = []
  board: Board = new Board('Test Board', [
    new Column('TO DO', this.toDoList),
    new Column('IN PROGRESS', []),
    new Column('DONE', []),
    new Column('BLOCKED', [])
  ]);

  constructor(private activatedroute: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.arrangeTasks(data.tasks)
    })
  }

  arrangeTasks(tasks) {
    for (const task of tasks ) {
      console.log(task.status);
      if ('CREATED' === task.status)
      {
        this.toDoList.push(task)
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  onAddTask() {
    const dialogRef = this.dialog.open(AddEditTaskDialogComponent, {
    height: '70%',
    width: '50%',
    // data: { booking }
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log(result)
  })}
}
