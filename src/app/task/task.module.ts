import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditTaskDialogComponent } from './add-edit-task-dialog/add-edit-task-dialog.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    AddEditTaskDialogComponent
  ],
  imports: [CommonModule,SharedModule]
})
export class TaskModule { }
