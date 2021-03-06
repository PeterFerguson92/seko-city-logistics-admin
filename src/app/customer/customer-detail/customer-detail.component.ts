import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ADD_BOOKING_CUSTOMER_MODE,
  ADD_CUSTOMER_MODE, COUNTRIES, COUNTRY_CODES, CREATE_BOOKING_MODE,
  CUSTOMER_SENDER_ROLE, CUSTOMER_TITLES, CUSTOMER_TYPES, EDIT_BOOKING_MODE, EDIT_CUSTOMER_MODE, VIEW_BOOKING_MODE
} from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService} from 'src/app/service/validation/validation.service';
import { AlertService } from 'src/app/shared/elements/alert/alert.service';
import { ICustomer } from '../model';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css', '../../shared/shared-new-form.css']
})
export class CustomerDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() customer: ICustomer;
  @Input() mode;
  @Output() closeDialog = new EventEmitter<string>();

  bookingModes = [CREATE_BOOKING_MODE, VIEW_BOOKING_MODE, EDIT_BOOKING_MODE, ADD_BOOKING_CUSTOMER_MODE]
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

  constructor(private router: Router,
    private activatedroute: ActivatedRoute, private formBuilder: FormBuilder, private customersService: CustomersService,
    private commonService: CommonService, private validationService: ValidationService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      console.log(data)
      this.customer = this.customer && this.customer.reference ? this.customer : data.customer

      // this.setAttributes(); TODO remove function
      this.loadCustomerForm = this.formBuilder.group({ref: ['', []]});
      this.addEditCustomerForm = this.formBuilder.group({
        type: [this.types[0], [Validators.required]],
        title: [this.titles[0], [Validators.required]],
        name: ['', Validators.required],
        surname: ['', Validators.required],
        registeredName: [''],
        registeredNumber: [''],
        email: ['', [Validators.required, Validators.email]],
        phoneGroup: this.formBuilder.group({
          countryCode: [this.countryCodes[0], [Validators.required]],
          phone: ['', [Validators.required]],}, { validators: [Validators.required, this.validationService.phoneValidator] }),
        postcode: ['', [Validators.required, this.validationService.postCodeValidator]],
        address: ['', [Validators.required]],
        country: [this.countries[0], [Validators.required]]
      });
      console.log(this.mode)

      if (this.customer && this.mode !== ADD_CUSTOMER_MODE)
      {
        this.populateFields()
      }
    })
  }


  ngAfterViewInit(): void {
    this.validateFormControl('registeredName');
    this.validateFormControl('name');
    this.validateFormControl('surname');
    this.validateFormControl('email');
    this.validateFormControl('address');
    this.validateFormControl('postcode');
    this.validateGroupFormControl('phoneGroup', 'phone')
  }

  onLoadCustomer() {
    this.customersService.getCustomerByReference(this.loadCustomerForm.get('ref').value).subscribe(
      ({ data }) => {
        if (data.customerByReference)
        {
          this.customer = data.customerByReference;
          this.populateFields()
        } else
        {
          this.alertService.success('Customer not found', this.alertOptions);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  populateFields() {
    const mainFormControl = this.addEditCustomerForm;
    const phoneGroupFormControl = this.addEditCustomerForm.get('phoneGroup');

    mainFormControl.patchValue({
      type: this.customer.type === '' ? this.types[0] : this.customer.type,
      title: this.customer.title,
      name: this.customer.name,
      surname: this.customer.surname,
      registeredName: this.customer.registeredName,
      registeredNumber: this.customer.registeredNumber,
      email: this.customer.email,
      address: this.customer.address,
      postcode: this.customer.postcode,
      country: this.customer.country === '' ? this.countries[0] : this.customer.country
    });

    phoneGroupFormControl.patchValue({
      countryCode: this.customer.countryCode,
      phone: this.customer.phone
    });
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
          if (this.isBookingMode())
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

  isBookingMode() {
    return this.bookingModes.includes(this.mode);
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
      this.addresses = this.commonService.getAddressesByPostcode(postcodeFormControl.value);
      return this.addresses;
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
   sender.role = CUSTOMER_SENDER_ROLE
   return sender;
 }

  setAttributes() {
    if (this.mode !== this.isBookingMode())
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
      this.buttonLabel = 'Update'
      this.showLoading = true;
    }
  }


  showWarning() {
    return !this.addEditCustomerForm.valid;
  }

   ngOnDestroy() {
  //  this.createCustomer.unsubscribe();
  }
}
