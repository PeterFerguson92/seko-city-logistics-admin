import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import {
  ADD_BOOKING_CUSTOMER_MODE,
  ADD_CUSTOMER_MODE, ADD_ORDER_CUSTOMER_MODE, COUNTRIES, COUNTRY_CODES, CREATE_BOOKING_MODE,
  CREATE_ORDER_MODE,
  CUSTOMER_ORDER_ROLE,
  CUSTOMER_SENDER_ROLE, CUSTOMER_TITLES, CUSTOMER_TYPES, EDIT_BOOKING_MODE, EDIT_CUSTOMER_MODE, EDIT_ORDER_MODE, VIEW_BOOKING_MODE
} from 'src/app/constants';
import { CREATE_ORDER } from 'src/app/order/service/requests';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService} from 'src/app/service/validation/validation.service';
import { AlertService } from 'src/app/shared/elements/alert/alert.service';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { ICustomer } from '../model';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css',
    '../../shared/shared-new-form.css',
  '../../shared/common.css']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  @Input() customer: ICustomer;
  @Input() mode;
  @Output() closeDialog = new EventEmitter<string>();

  bookingOrderModes = [CREATE_BOOKING_MODE, VIEW_BOOKING_MODE, EDIT_BOOKING_MODE, ADD_BOOKING_CUSTOMER_MODE,
  CREATE_ORDER_MODE, EDIT_ORDER_MODE, ADD_ORDER_CUSTOMER_MODE]
  buttonLabel;
  showLoading = false;
  createCustomer;
  addresses = [];
  exclusionList=['reference', 'fullName', 'displayAddress','fullPhoneNumber', 'destination','location','role']
  addEditCustomerForm: FormGroup;
  loadCustomerForm: FormGroup;
  formValidationMap = { ref: '', name: '', surname: '', registeredName: '', phone: '', email: '', address: '', postcode: '', country: '' };

  titlePrefix = 'Add';
  types = CUSTOMER_TYPES;
  titles = CUSTOMER_TITLES;
  countries = COUNTRIES;
  countryCodes = COUNTRY_CODES
  alertOptions = { autoClose: true, keepAfterRouteChange: false };

  showErrorText;
  errorText

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private customersService: CustomersService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.buildForm();
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    if (snapshot.routeConfig.path !== 'add-customer')
    {
      this.getCustomerByReference(reference);
    }
  }

  buildForm() {
    this.loadCustomerForm = this.formBuilder.group({ref: ['', []]});
    this.addEditCustomerForm = this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      title: [this.titles[0], [Validators.required]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      registeredName: [''],
      registeredNumber: [''],
      email: ['', [Validators.email]],
      phoneGroup: this.formBuilder.group({
        countryCode: [this.countryCodes[0], [Validators.required]],
        phone: ['', [Validators.required]],}, { validators: [Validators.required, this.validationService.phoneValidator] }),
      postcode: ['', [Validators.required, this.validationService.postCodeValidator]],
      address: ['', [Validators.required]],
      country: [this.countries[0], [Validators.required]]
    });
  }

  getCustomerByReference(reference) {
    this.spinner.show();
    this.customersService.getCustomerByReference(reference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          if (result.data === null || result.data.customerByReference === null)
          {
            this.router.navigate(['/not-found']);
          }
          this.showErrorText = false;
          this.errorText = null;
          const customer = result.data.customerByReference;
          this.populateFields(customer);
        },
        error: (error) => {
          console.log(error.message);
          console.log(error)
          this.spinner.hide()
          this.dialog.open(InfoDialogComponent, {
            height: '30%',
            width: '30%',
            data: { message: `Sorry couldn't retrieve shipment with reference ${reference}` }
          });
        }
      })
    }

  setMode() {
    if (this.router.url.includes('edit-customer'))
    {
      this.mode = EDIT_CUSTOMER_MODE;
    } else
    {
      if (this.router.url.includes('add-customer'))
      {
        this.mode = ADD_CUSTOMER_MODE;
      }
    }
  }

  onLoadCustomer() {
    const reference = this.loadCustomerForm.get('ref').value;
    this.populateFields(reference);
  }

  clearNotification() {
    setTimeout(function() {
      this.showErrorText = false;
      this.errorText = null;
    }.bind(this), 3000);
  }

  populateFields(customer) {
    const mainFormControl = this.addEditCustomerForm;
    const phoneGroupFormControl = this.addEditCustomerForm.get('phoneGroup');
    mainFormControl.patchValue({
      type: customer.type === '' ? this.types[0] : customer.type,
      title: customer.title,
      name: customer.name,
      surname: customer.surname,
      registeredName: customer.registeredName,
      registeredNumber: customer.registeredNumber,
      email: customer.email,
      address: customer.address,
      postcode: customer.postcode,
      country: customer.country === '' ? this.countries[0] : customer.country
    });

    phoneGroupFormControl.patchValue({
      countryCode: customer.countryCode,
      phone: customer.phone
    });

    this.getAddressByPostcode();
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.getValidationMessage(fControl, fControlName);
      });
  }

  validateGroupFormControl(formGroupName: string, fControlName: string) {
    const fGroup = this.addEditCustomerForm.get(formGroupName);
    const fMainControl = fGroup.get(fControlName);
    this.validationService.watchAndValidateFormControl(fGroup)
      .subscribe(() => {
        this.formValidationMap.phone = this.validationService.getGroupValidationMessage(fGroup, fMainControl, fControlName);
        if (fGroup.dirty && !fGroup.valid)
        {
          fMainControl.markAsDirty();
          fMainControl.setErrors({ phone: 'Phone number' });

        } else
        {
          fGroup.setErrors(null);
        }
      });
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();

    const registeredNameFormControl = this.getFormControl('registeredName');
    if (fControlName === 'type' && event.value !== 'PERSONAL')
    {
      registeredNameFormControl.setValidators([Validators.required]);
    } else
    {
      registeredNameFormControl.setErrors(null);
      registeredNameFormControl.markAsPristine();
    }
  }

  onCancel() {
    this.closeDialog.next('closeDialog');
  }

  onAddEdit() {
    this.mode === EDIT_CUSTOMER_MODE ? this.editCustomer() : this.addCustomer();
  }

  onPostcodeChange() {
    this.getAddressByPostcode()
  }

  addCustomer() {
    const createCustomerData = 'createCustomer'
    this.createCustomer = this.customersService.createCustomer(this.getCustomerDetails()).subscribe(
      ({ data }) => {
        this.router.navigate(['/customers']).then(() => {
          window.location.reload();
        });  // To handle properly
      },
      error => {
        console.log(error);
      }
    );
  }


  editCustomer() {
    const updateCustomerFields = []
    Object.keys(this.addEditCustomerForm.controls).forEach(key => {
      const formControl = this.addEditCustomerForm.controls[key]
      if (!formControl.pristine && formControl.value !== this.customer[key])
      {
        updateCustomerFields.push({ name: key, value: formControl.value });
      }
    });

    if (updateCustomerFields.length > 0)
    {
      this.customersService.updateCustomer(this.customer.reference, updateCustomerFields).subscribe(
        ({ data }) => {
          if (this.isBookingOrderMode())
          {
            this.alertService.warn('Customer updated correctly', this.alertOptions);
          } else
          {
            this.router.navigate(['/customers']).then(() => {
              window.location.reload();
            });
          }
          this.addEditCustomerForm.markAsPristine();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  isCustomerPersonal() {
    return this.commonService.isCustomerPersonal(this.getFormControl('type').value);
  }

  isDisabled() {
    return !this.addEditCustomerForm.valid;
  }

  isLoadDisabled() {
     return this.loadCustomerForm.get('ref').value === '';
  }

  isBookingOrderMode() {
    return this.bookingOrderModes.includes(this.mode);
  }

  isCreateBookingMode() {
    return CREATE_BOOKING_MODE === this.mode;
  }

  getFormControl(fControlName: string) {
    return fControlName === 'phone' || fControlName === 'countryCode' ? this.addEditCustomerForm.get('phoneGroup').get(fControlName) :
      this.addEditCustomerForm.get(fControlName)
  }

  getAddressByPostcode() {
    const postcodeFormControl = this.getFormControl('postcode');
    if (!postcodeFormControl.invalid)
    {
      this.commonService.getAddresses(postcodeFormControl.value).subscribe(
        ({ data }) => {
          this.addresses = data.addressesInfo.addresses;
        },
        error => {
          console.log(error);
        }
      );
    } else
    {
      this.addresses = [];
    }
  }

  getCustomerDetails(): ICustomer {
    const customerDetails = this.customersService.getEmptyCustomer();
    Object.entries(customerDetails).forEach((key) => {
      const attributeName = key[0];
      if (this.exclusionList.indexOf(attributeName) > -1)
      {
        return
      }
      if (attributeName === 'registeredName' || attributeName === 'registeredNumber')
      {
        customerDetails[attributeName] = this.getFormControl('type').value === 'PERSONAL' ? ''
          : this.getFormControl(attributeName).value;
      } else
      {
        customerDetails[attributeName] =  this.getFormControl(attributeName).value;
      }
    })
    // tslint:disable-next-line:no-string-literal
    customerDetails['role'] = CUSTOMER_SENDER_ROLE
    return customerDetails;
  }

 getSenderDetails() {
    const sender: any = {
      type: '', registeredName: '', registeredNumber: '', title: '', name: '', surname: '', countryCode: '', phone: '',
      email: '', postcode: '', address: '', country: ''
    }
    Object.entries(sender).forEach((key) => {
      const attributeName = key[0];
      sender[attributeName] = this.getFormControl(attributeName).value;
    })
   sender.reference = this.customer ? this.customer.reference : null;
   sender.role = this.mode === CREATE_ORDER ? CUSTOMER_ORDER_ROLE : CUSTOMER_SENDER_ROLE
   return sender;
 }

  setAttributes() {
    if (this.mode !== this.isBookingOrderMode())
    {
      this.showLoading = false;
      if (this.mode === ADD_CUSTOMER_MODE)
      {
        this.titlePrefix = 'Add';
        this.buttonLabel = 'ADD'
      } else
      {
        this.titlePrefix = 'Edit';
        this.buttonLabel = 'UPDATE'
      }
    } else
    {
      this.titlePrefix = 'Book';
      this.buttonLabel = 'Update';
      this.showLoading = true;
    }
  }

  showWarning() {
    return !this.addEditCustomerForm.valid;
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
