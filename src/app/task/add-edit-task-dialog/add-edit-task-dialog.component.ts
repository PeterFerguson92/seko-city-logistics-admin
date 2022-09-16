import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TASK_PRIORITY_STATUSES } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-add-edit-task-dialog',
  templateUrl: './add-edit-task-dialog.component.html',
  styleUrls: ['./add-edit-task-dialog.component.css', '../../shared/shared.dialog.css']
})
export class AddEditTaskDialogComponent implements OnInit {
  addEditTaskForm: FormGroup;
  priorityStatuses = TASK_PRIORITY_STATUSES;

  constructor(private formBuilder: FormBuilder,
    private taskService: TaskService, private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    const formValues = this.getFormValue(this.data);
    this.addEditTaskForm = this.formBuilder.group({
      title: [formValues.title, Validators.required],
      description: [formValues.description],
      actionDate: [formValues.actionDate ? new Date(formValues.actionDate) : null, Validators.required],
      priority: [this.priorityStatuses[0], Validators.required],
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
      priority: this.getFormControl('priority').value
    }

    this.taskService.createTask(task).subscribe(
      ({ data }) => {
        window.location.reload()
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
          window.location.reload()
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  onSelectionChange(event: any) {
    const fControl = this.getFormControl('priority');
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  getFormControl(fControlName: string) {
    return this.addEditTaskForm.get(fControlName)
  }

}
