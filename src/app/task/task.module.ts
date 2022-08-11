import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditTaskDialogComponent } from './add-edit-task-dialog/add-edit-task-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    AddEditTaskDialogComponent,
    TaskCardComponent,
    TaskBoardComponent
  ],
  imports: [CommonModule, SharedModule, DragDropModule]
})
export class TaskModule { }
