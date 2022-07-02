import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COUNTRIES } from 'src/app/constants';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Component({
  selector: 'app-add-edit-driver',
  templateUrl: './add-edit-driver.component.html',
  styleUrls: ['./add-edit-driver.component.css','../../shared/shared-new-form.css']
})
export class AddEditDriverComponent implements OnInit {
  addEditDriverForm: FormGroup;
  countries = COUNTRIES;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService) { }

  ngOnInit(): void {

    this.addEditDriverForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      country: [this.countries[0], [Validators.required]]
    })
  }

  getFormControl(fControlName: string) {
    return this.addEditDriverForm.get(fControlName)
  }

  onSelectionChange(event: any) {
    const fControl = this.getFormControl('country');
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  onSubmit() {
    const driverDetails = {password: null, role: 'DRIVER'};
    Object.keys(this.addEditDriverForm.controls).forEach(key => {
      const formControl = this.addEditDriverForm.controls[key];
      driverDetails[key] = formControl.value;
    });

    this.authService.signUp(driverDetails).subscribe(
      ({ data }) => { console.log(data); },
      error => { console.log(error); }
    );



    console.log(driverDetails);
  }

  isDisabled() {
    return false;
  }

}
