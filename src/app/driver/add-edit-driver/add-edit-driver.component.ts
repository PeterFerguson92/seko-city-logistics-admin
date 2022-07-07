import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  countryCodes = COUNTRY_CODES;
  driver;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService,
    private validationService: ValidationService, private activatedroute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {

      if (data.driver)
      {
        this.driver = data.driver.getDriver.users[0];
        const phoneNumberData = this.splitPhoneNumber(this.driver.phoneNumber)
        this.buildFormGroup(data.driver.getDriver.users[0], phoneNumberData)
      }
      else
      {
        this.buildFormGroup(null, null)
      }
    })
  }

  buildFormGroup(driver, phoneNumberData) {
    this.addEditDriverForm = this.formBuilder.group({
      name: [driver ? this.driver.name : '', [Validators.required]],
      lastName: [driver ? this.driver.lastName : '', [Validators.required]],
      userName: [driver ? this.driver.userName : '', [Validators.required]],
      email: [driver ? this.driver.email : '', [Validators.required]],
      phoneGroup: this.formBuilder.group({
        countryCode: [driver && phoneNumberData ? phoneNumberData.countryCode : this.countryCodes[0], [Validators.required]],
        phone: [driver && phoneNumberData ? phoneNumberData.number : '', [Validators.required]],
      }, { validators: [Validators.required, this.validationService.phoneValidator] }),
      country: [driver ? this.driver.country : this.countries[0], [Validators.required]]
    })

    if (driver)
    {
      this.addEditDriverForm.get('userName').disable();
      this.addEditDriverForm.get('email').disable();

    }

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
    console.log(this.driver);
    if (this.driver)
    {
      this.updateDriver();
    } else
    {
      this.createDriver()
    }
  }

  createDriver() {
    const driverDetails = { password: null, role: 'DRIVER', phone: this.getPhoneNumber() };
    Object.keys(this.addEditDriverForm.controls).forEach(key => {
      const formControl = this.addEditDriverForm.controls[key];
      if (!(key === 'phoneGroup'))
      {
        driverDetails[key] = formControl.value;
      }
    });

    this.authService.signUp(driverDetails).subscribe(
      ({ data }) => { this.router.navigate(['/drivers']); },
      error => { console.log(error); }
    );
  }

  updateDriver() {
    const updateDriverFields = []
    Object.keys(this.addEditDriverForm.controls).forEach(key => {
      const formControl = this.addEditDriverForm.controls[key]

      if (!formControl.pristine && formControl.value !== this.driver[key])
      {
        if (key === 'phoneGroup')
        {
          const countryCodeFormControl = this.getFormControl('countryCode');
          const numberFormControl = this.getFormControl('number');

          if (countryCodeFormControl.pristine || numberFormControl.pristine)
          {
            updateDriverFields.push({ name: 'phoneNumber', value: this.getPhoneNumber() });
          }
        } else
        {
          updateDriverFields.push({ name: key, value: formControl.value });
        }
      }
    });

    if (updateDriverFields.length > 0)
    {
      this.authService.updateUser(this.getFormControl('username').value, updateDriverFields).subscribe(
        ({ data }) => { this.router.navigate(['/drivers']); },
        error => { console.log(error); }
      );
    }
  }

  getPhoneNumber() {
    return this.getFormControl('countryCode').value + this.getFormControl('phone').value;
  }

  splitPhoneNumber(phoneNumber) {
    return {countryCode: phoneNumber.substring(0, 3), number: phoneNumber.substring(3, phoneNumber.length) }
  }

  isDisabled() {
    return this.addEditDriverForm.pristine;
  }

}
