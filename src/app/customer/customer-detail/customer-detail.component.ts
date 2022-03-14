import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ADD_CUSTOMER_MODE, BOOK_CUSTOMER_MODE, COUNTRIES, COUNTRY_CODES, CUSTOMER_TYPES } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService} from 'src/app/service/validation/validation.service';
import { AlertService } from 'src/app/shared/elements/alert/alert.service';
import { ICustomer } from '../domain';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css', '../../shared/shared.css']
})
export class CustomerDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() customer: ICustomer;
  @Input() mode;
  @Output() closeDialog = new EventEmitter<string>();

  buttonLabel;
  hideCancelButton;
  createCustomer;
  addresses = [];
  addEditCustomerForm: FormGroup;
  formValidationMap = {fullName: '',phone: '',email: '',address: '',postcode: '',country: ''};
  titlePrefix = 'Add';
  types = CUSTOMER_TYPES;
  countries = COUNTRIES;
  countryCodes = COUNTRY_CODES
  alertOptions = {autoClose: true, keepAfterRouteChange: false};

  constructor(private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private commonService: CommonService,
    private validationService: ValidationService,
    public alertService: AlertService) { }

  ngOnInit(): void {
    this.setAttributes();
    this.addEditCustomerForm = this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      fullName: ['', Validators.required],
      phoneGroup: this.formBuilder.group({
        phoneCountryCode: [this.countryCodes[0], [Validators.required]],
        phone: ['', [Validators.required]],
      }, { validators: [Validators.required, this.validationService.phoneValidator] }),
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      postcode: ['', [Validators.required, this.validationService.postCodeValidator]],
      country: [this.countries[0], [Validators.required]]
    });
    if (this.customer && this.mode !== ADD_CUSTOMER_MODE)
    {
      this.populateFields()
    }
  }

  ngAfterViewInit(): void {
    this.validateFormControl('fullName');
    this.validateFormControl('phone');
    this.validateFormControl('email');
    this.validateFormControl('address');
    this.validateFormControl('postcode');
    this.validateGroupFormControl('phoneGroup', 'phone')
  }

  onAddEdit() {
    this.mode === ADD_CUSTOMER_MODE ? this.addCustomer() : this.editCustomer();
  }

  addCustomer() {
    const createCustomerData = 'createCustomer'
    this.createCustomer = this.customersService.createCustomer(this.getCustomerAttributes()).subscribe(
      ({ data }) => {
        if (this.mode === BOOK_CUSTOMER_MODE)
        {
          this.alertService.success('Customer added correctly', this.alertOptions);
        } else
        {
          location.reload();  // To handle properly
        }
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
      this.customersService.updateCustomer(this.customer.uuid, updateCustomerFields).subscribe(
        ({ data }) => {
          if (this.mode === BOOK_CUSTOMER_MODE)
          {
            this.alertService.success('Customer updated correctly', this.alertOptions);
          } else
          {
            location.reload();  // To handle properly
          }
          this.addEditCustomerForm.markAsPristine();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  validateFormControl(fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(() => {
        this.formValidationMap[fControlName] = this.validationService.setMessage(fControl, fControlName);
      });
  }

  validateGroupFormControl(formGroupName: string, fControlName: string) {
    const fGroup = this.addEditCustomerForm.get(formGroupName);
    const fMainControl = fGroup.get(fControlName);
    this.validationService.watchAndValidateFormControl(fGroup)
      .subscribe(() => {
        this.formValidationMap.phone = this.validationService.setMessage(fGroup, fControlName);
        if (fGroup.dirty && !fGroup.valid)
        {
          fMainControl.markAsDirty();
          // fMainControl.setErrors({ telephone: 'Phone number' });

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
  }

  getAddressByPostcode() {
    const postcodeFormControl = this.getFormControl('postcode');
    if (!postcodeFormControl.invalid)
    {
      this.addresses = this.commonService.getAddressesByPostcode(postcodeFormControl.value);
      return this.addresses;
    }
  }

  getCustomerAttributes(): ICustomer {
   return  {
      uuid: '',
      fullName: this.getFormControl('fullName').value,
      address: this.getFormControl('address').value,
      postcode: this.getFormControl('postcode').value,
      phone: this.commonService.getFormattedPhoneNumber(this.getFormControl('phoneCountryCode').value , this.getFormControl('phone').value),
      email: this.getFormControl('email').value,
      country: this.getFormControl('country').value,
      type: this.getFormControl('type').value,
      destination: ''
    };
  }

  onCancel() {
    this.closeDialog.next('closeDialog');
  }

  populateFields() {
    const mainFormControl = this.addEditCustomerForm;
    const phoneGroupFormControl = this.addEditCustomerForm.get('phoneGroup');

    mainFormControl.patchValue({
      type: this.customer.type === '' ? this.types[0] : this.customer.type,
      fullName: this.customer.fullName,
      email: this.customer.email,
      address: this.customer.address,
      postcode: this.customer.postcode,
      country: this.customer.country === '' ? this.countries[0] : this.customer.country
    });

    const fullPhone = this.customer.phone;
    const spaceIndex = fullPhone.indexOf(' ');  // Gets the first index where a space occours
    const phoneCountryCode = fullPhone.substr(0, spaceIndex); // Gets the first part
    const phone = fullPhone.substr(spaceIndex + 1);

    phoneGroupFormControl.patchValue({phone, phoneCountryCode});
  }

  setAttributes() {
    this.hideCancelButton = this.mode !== BOOK_CUSTOMER_MODE;

    if (this.mode !== BOOK_CUSTOMER_MODE)
    {
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
    }
  }

    // TODO find a way to proper handle enable/disable of button, at the moment it's enabled when a value is changed,
    // to find a way to enable when the value have actually changed
   isDisabled() {
    if (this.mode === ADD_CUSTOMER_MODE)
    {
      return !this.addEditCustomerForm.valid;
    } else
    {
      return this.addEditCustomerForm.pristine || !this.addEditCustomerForm.valid;
    }
   }

  getFormControl(fControlName: string) {
    return fControlName === 'phone' || fControlName === 'phoneCountryCode' ? this.addEditCustomerForm.get('phoneGroup').get(fControlName) :
      this.addEditCustomerForm.get(fControlName)
  }

   ngOnDestroy() {
  //  this.createCustomer.unsubscribe();
  }

}
