import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { COUNTRIES, COUNTRY_CODES } from 'src/app/constants';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { ValidationService } from 'src/app/service/validation/validation.service';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';

@Component({
  selector: 'app-add-edit-driver',
  templateUrl: './add-edit-driver.component.html',
  styleUrls: ['./add-edit-driver.component.css','../../shared/shared-new-form.css']
})
export class AddEditDriverComponent implements OnInit, AfterViewInit, OnDestroy {

  driver;
  errorText;
  showErrorText = false;
  countries = COUNTRIES;
  countryCodes = COUNTRY_CODES;
  addEditDriverForm: FormGroup;
  componentDestroyed$: Subject<boolean> = new Subject();
  formValidationMap = {name: '', lastName: '', username: '', email: '', phone: '', country: '' };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.buildFormGroup(null, null);
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    if (snapshot.routeConfig.path !== 'add-driver')
    {
      this.getDriverByReference(reference);
    }
  }

  getDriverByReference(reference) {
    this.spinner.show();
    this.authService.getDriver(reference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
      next: (result) => {
          if (result === null || result.data === null ||
            result.data.getDriver === null)
          {
            this.router.navigate(['/not-found']);
          }
          this.driver = result.data.getDriver.users[0];
          const phoneNumberData = this.splitPhoneNumber(this.driver.phoneNumber);
          this.addEditDriverForm.patchValue({
            name: this.driver.name,
            lastName: this.driver.lastName,
            username: this.driver.username,
            email: this.driver.email,
            country: this.driver.country
          })
          this.addEditDriverForm.get('phoneGroup').patchValue({
            countryCode: phoneNumberData.countryCode,
            phone: phoneNumberData.number
          })
      },
        error: (error) => {
          console.log(error.message);
          console.log(error)
          this.spinner.hide()
          this.dialog.open(InfoDialogComponent, {
            height: '30%',
            width: '30%',
            data: { message: `Sorry couldn't retrieve driver with reference ${reference}` }
          });
      }
    })
  }

  buildFormGroup(driver, phoneNumberData) {
    this.addEditDriverForm = this.formBuilder.group({
      name: [driver ? this.driver.name : '', [Validators.required]],
      lastName: [driver ? this.driver.lastName : '', [Validators.required]],
      username: [driver ? this.driver.username : '', [Validators.required]],
      email: [driver ? this.driver.email : '', [Validators.required, Validators.email]],
      phoneGroup: this.formBuilder.group({
        countryCode: [driver && phoneNumberData ? phoneNumberData.countryCode : this.countryCodes[0], [Validators.required]],
        phone: [driver && phoneNumberData ? phoneNumberData.number : '', [Validators.required]],
      }, { validators: [Validators.required, this.validationService.phoneValidator] }),
      country: [driver ? this.driver.country : this.countries[0], [Validators.required]]
    })

    if (driver)
    {
      this.addEditDriverForm.get('username').disable();
      this.addEditDriverForm.get('email').disable();
    }
  }

  ngAfterViewInit(): void {
    this.validateFormControl('name');
    this.validateFormControl('lastName');
    this.validateFormControl('username');
    this.validateFormControl('email');
    this.validateFormControl('phone');
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

    this.authService.signUp(driverDetails)
    .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: () => {
            this.router.navigate(['/drivers']).then(() => {
              window.location.reload();
            });},
          error: (error) => {
            console.log(error.message);
            console.log(error)
            this.showErrorText = true
            this.errorText = `Operation failed: Please contact system support`;
            this.spinner.hide()
          }
       })
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
      this.authService.updateUser(this.getFormControl('username').value, updateDriverFields).pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: () => {
            this.router.navigate(['/drivers']).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            console.log(error.message);
            console.log(error)
            this.spinner.hide()
            this.dialog.open(InfoDialogComponent, {
              height: '30%',
              width: '30%',
              data: { message: `Sorry couldn't update driver, Please contact System support` }
            });
          }
        })
    }
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
      });
  }

  getPhoneNumber() {
    return this.getFormControl('countryCode').value + this.getFormControl('phone').value;
  }

  splitPhoneNumber(phoneNumber) {
    return {countryCode: phoneNumber.substring(0, 3), number: phoneNumber.substring(3, phoneNumber.length) }
  }

  isDisabled() {
    return !this.addEditDriverForm.valid;
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

}
