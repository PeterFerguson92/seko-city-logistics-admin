import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-add-edit-task-dialog',
  templateUrl: './add-edit-task-dialog.component.html',
  styleUrls: ['./add-edit-task-dialog.component.css']
})
export class AddEditTaskDialogComponent implements OnInit {
  addEditTaskForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private taskService: TaskService, private commonService: CommonService,
    private dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    const formValues = this.getFormValue(this.data);
    this.addEditTaskForm = this.formBuilder.group({
      title: [formValues.title, Validators.required],
      description: [formValues.description, Validators.required],
      actionDate: [new Date(formValues.actionDate), Validators.required],
    })
  }

  getFormValue(data) {
    return data && data.task ?
      { title: data.task.title, description: data.task.description, actionDate: data.task.actionDate } :
      { title: null, description: null, actionDate: null };
  }

  isDisabled() {
    return !this.addEditTaskForm.valid;
  }

  onInputChange(event) {
    const fControl = this.getFormControl('actionDate');
    fControl.setValue(event)
    fControl.markAsDirty();
  }

  onSubmit() {
    if (this.data && this.data.task)
    {
      this.updateTask()
    } else
    {
      this.createTask();
    }
  }

  createTask() {
    const task = {
      title: this.getFormControl('title').value,
      description: this.getFormControl('description').value,
      actionDate: this.commonService.getFormattedIsoDate(this.getFormControl('actionDate').value),
    }

    this.taskService.createTask(task).subscribe(
      ({ data }) => {
        this.dialogRef.close()
      },
      error => {
        console.log(error);
      }
    );
  }

  updateTask() {
    const updateFields = []
    Object.keys(this.addEditTaskForm.controls).forEach(key => {
      const formControl = this.addEditTaskForm.controls[key]
      if (!formControl.pristine && formControl.value !== this.data.task[key])
      {
        updateFields.push({ name: key, value: formControl.value });
      }
    });

    if (updateFields.length > 0)
    {
      this.taskService.updateTask(this.data.task.id, updateFields).subscribe(
        ({ data }) => {
          this.dialogRef.close()
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getFormControl(fControlName: string) {
    return this.addEditTaskForm.get(fControlName)
  }

}
