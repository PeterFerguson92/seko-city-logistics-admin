import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from './models/board.model';
import { Column } from './models/column.model';
import { MatDialog } from '@angular/material/dialog';
import { AddEditTaskDialogComponent } from '../add-edit-task-dialog/add-edit-task-dialog.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css', './../../shared/shared-new-form.css']
})
export class TasksComponent implements OnInit {
  board: Board = new Board('Test Board', [
    new Column('TO DO', [
      'Some random ideasdsahas',
      'This is another random idea',
      'build an awesome application'
    ]),
    new Column('IN PROGRESS', [
      'Lorem ipsum',
      'foo',
      'This was in the \'Research\' column'
    ]),
    new Column('DONE', [
      'Get to work',
      'Pick up groceries',
      'Go home',
      'Fall asleep'
    ]),
    new Column('BLOCKED', [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog'
    ])
  ]);
  constructor(private activatedroute: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
     console.log(data)
    })
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
