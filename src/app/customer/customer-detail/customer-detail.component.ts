import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ADD_CUSTOMER_MODE, BOOK_CUSTOMER_MODE, COUNTRIES, COUNTRY_CODES, CUSTOMER_TITLES, CUSTOMER_TYPES } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService} from 'src/app/service/validation/validation.service';
import { AlertService } from 'src/app/shared/elements/alert/alert.service';
import { ICustomer } from '../model';
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

  constructor(private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private commonService: CommonService,
    private validationService: ValidationService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.setAttributes();
    this.loadCustomerForm = this.formBuilder.group({
      ref: ['', []]
    });

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
        phone: ['', [Validators.required]],
      }, { validators: [Validators.required, this.validationService.phoneValidator] }),
      postcode: ['', [Validators.required, this.validationService.postCodeValidator]],
      address: ['', [Validators.required]],
      country: [this.countries[0], [Validators.required]]
    });
    if (this.customer && this.mode !== ADD_CUSTOMER_MODE)
    {
      this.populateFields()
    }
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
    this.mode === ADD_CUSTOMER_MODE ? this.addCustomer() : this.editCustomer();
  }

  addCustomer() {
    const createCustomerData = 'createCustomer'
    this.createCustomer = this.customersService.createCustomer(this.getCustomerDetails()).subscribe(
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
      this.customersService.updateCustomer(this.customer.reference, updateCustomerFields).subscribe(
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

  isCustomerPersonal() {
    return this.getFormControl('type').value === 'PERSONAL';
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
      console.log(attributeName)
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
    return customerDetails;
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

  setAttributes() {
    if (this.mode !== BOOK_CUSTOMER_MODE)
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

    // TODO find a way to proper handle enable/disable of button, at the moment it's enabled when a value is changed,
    // to find a way to enable when the value have actually changed
  isDisabled() {
    return !this.addEditCustomerForm.valid;
  }

  isLoadDisabled() {
     return this.loadCustomerForm.get('ref').value === '';
  }

  isBookingMode() {
    return this.mode === BOOK_CUSTOMER_MODE;
  }

  getFormControl(fControlName: string) {
    return fControlName === 'phone' || fControlName === 'countryCode' ? this.addEditCustomerForm.get('phoneGroup').get(fControlName) :
      this.addEditCustomerForm.get(fControlName)
  }

  getSenderDetails() {
    const sender: any = { type: '', fullName: '', countryCode: '', phone: '', email: '', postcode: '' , address:'', country: ''}
    Object.entries(sender).forEach((key) => {
      const attributeName = key[0];
      sender[attributeName] = this.getFormControl(attributeName).value;
    })
    return sender;
  }


   ngOnDestroy() {
  //  this.createCustomer.unsubscribe();
  }

}
