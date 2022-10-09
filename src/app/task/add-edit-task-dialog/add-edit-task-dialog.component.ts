import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { TASK_PRIORITY_STATUSES, WEB_TASK_PICK_UP_REQUEST } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { TaskService } from '../service/task.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-edit-task-dialog',
  templateUrl: './add-edit-task-dialog.component.html',
  styleUrls: ['./add-edit-task-dialog.component.css', '../../shared/shared.dialog.css']
})
export class AddEditTaskDialogComponent implements OnInit, OnDestroy {
  errorText: string;
  showErrorText: boolean;
  addEditTaskForm: FormGroup;
  priorityStatuses = TASK_PRIORITY_STATUSES;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

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
    this.spinner.show()
    const task = {
      title: this.getFormControl('title').value,
      description: this.getFormControl('description').value,
      actionDate: this.commonService.getFormattedIsoDate(this.getFormControl('actionDate').value),
      priority: this.getFormControl('priority').value
    }

    if (task.title !== WEB_TASK_PICK_UP_REQUEST)
    {
      this.taskService.createTask(task)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: () => { window.location.reload()},
        error: (error) => {
          this.spinner.hide()
          console.log(error)
          this.showErrorText = true;
          this.errorText = 'Something went wrong, Please contact support';
          this.clearNotification()
        }
     })
    } else
    {
      this.spinner.hide();
      this.showErrorText = true;
      this.errorText = 'Task title not valid';
      this.clearNotification()
    }
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
      if (this.isTitleUpdateValid(updateFields))
      {
        this.spinner.show();
        this.taskService.updateTask(this.data.task.id, updateFields)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe({
            next: () => { window.location.reload() },
            error: (error) => {
              this.spinner.hide()
              console.log(error)
              this.showErrorText = true;
              this.errorText = 'Something went wrong, Please contact support';
              this.clearNotification()
            }
          })
      } else
      {
        this.showErrorText = true;
        this.errorText = 'Task title not valid';
        this.clearNotification();
        this.spinner.hide();
      }
    }
  }

  isTitleUpdateValid(updateFields) {
    return updateFields.filter(e => e.title === WEB_TASK_PICK_UP_REQUEST).length > 0
  }

  clearNotification() {
    setTimeout(function () {
      this.showErrorText = false;
      this.errorText = null;
    }.bind(this), 3000);
  }

  clearFields() {
    Object.keys(this.addEditTaskForm.controls).forEach(key => {
      this.addEditTaskForm.controls[key].reset()
    });
  }

  onSelectionChange(event: any) {
    const fControl = this.getFormControl('priority');
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  getFormControl(fControlName: string) {
    return this.addEditTaskForm.get(fControlName)
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
