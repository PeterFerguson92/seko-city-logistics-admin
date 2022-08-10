import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-task-dialog',
  templateUrl: './add-edit-task-dialog.component.html',
  styleUrls: ['./add-edit-task-dialog.component.css']
})
export class AddEditTaskDialogComponent implements OnInit {
  addEditTaskForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

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

  }

  getFormControl(fControlName: string) {
    return this.addEditTaskForm.get(fControlName)
  }

}
