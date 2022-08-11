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
    this.addEditTaskForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      actionDate: [null, Validators.required],
    })
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
    this.createTask()
  }

  createTask() {
    const task = {
      title: this.getFormControl('title').value,
      description: this.getFormControl('description').value,
      actionDate: this.commonService.getFormattedIsoDate(this.getFormControl('actionDate').value),
    }
    console.log(task)

    this.taskService.createTask(task).subscribe(
      ({ data }) => {
       // this.redirectToShipments();
        this.dialogRef.close()
      },
      error => {
        console.log(error);
      }
    );
  }

  redirectToShipments() {
    this.router.navigate(['/shipments']).then(() => {
      window.location.reload();
    });
  }

  getFormControl(fControlName: string) {
    return this.addEditTaskForm.get(fControlName)
  }

}
