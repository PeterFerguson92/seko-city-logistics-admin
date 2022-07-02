import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COUNTRIES, COUNTRY_CODES } from 'src/app/constants';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { ValidationService } from 'src/app/service/validation/validation.service';

@Component({
  selector: 'app-add-edit-driver',
  templateUrl: './add-edit-driver.component.html',
  styleUrls: ['./add-edit-driver.component.css','../../shared/shared-new-form.css']
})
export class AddEditDriverComponent implements OnInit {
  addEditDriverForm: FormGroup;
  countries = COUNTRIES;
  countryCodes = COUNTRY_CODES

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService,
    private validationService: ValidationService,) { }

  ngOnInit(): void {

    this.addEditDriverForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneGroup: this.formBuilder.group({
        countryCode: [this.countryCodes[0], [Validators.required]],
        phone: ['', [Validators.required]],}, { validators: [Validators.required, this.validationService.phoneValidator] }),
      country: [this.countries[0], [Validators.required]]
    })
  }

  getFormControl(fControlName: string) {
    return fControlName === 'phone' || fControlName === 'countryCode' ? this.addEditDriverForm.get('phoneGroup').get(fControlName) :
    this.addEditDriverForm.get(fControlName)
  }

  onSelectionChange(event: any, formControlName) {
    const fControl = this.getFormControl(formControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  onSubmit() {
    const driverDetails = { password: null, role: 'DRIVER', phone: this.getPhoneNumber() };

    Object.keys(this.addEditDriverForm.controls).forEach(key => {
      const formControl = this.addEditDriverForm.controls[key];
      if (!(key === 'phoneGroup'))
      {
        driverDetails[key] = formControl.value;
      }
    });

    this.authService.signUp(driverDetails).subscribe(
      ({ data }) => { console.log(data); },
      error => { console.log(error); }
    );
  }

  getPhoneNumber() {
    return this.getFormControl('countryCode').value + this.getFormControl('phone').value;
  }

  isDisabled() {
    return false;
  }

}
