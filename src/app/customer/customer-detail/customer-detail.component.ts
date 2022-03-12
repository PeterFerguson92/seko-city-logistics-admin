import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ADD_CUSTOMER_MODE, BOOK_CUSTOMER_MODE } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService, postCodeValidator, phoneValidator } from 'src/app/service/validation/validation.service';
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
  types = ['PERSONAL', 'BUSINESS', 'CHARITY'];
  countries = ['UNITED KINGDOM', 'GHANA'];
  alertOptions = {autoClose: true, keepAfterRouteChange: false};

  constructor(private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private commonService: CommonService,
    private validationService: ValidationService,
    public alertService: AlertService) { }

  ngAfterViewInit(): void {
    this.validateFormControl('fullName');
    this.validateFormControl('phone');
    this.validateFormControl('email');
    this.validateFormControl('address');
    this.validateFormControl('postcode');
  }

  ngOnInit(): void {

    this.setAttributes();
    this.addEditCustomerForm = this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, phoneValidator]],
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      postcode: ['', [Validators.required, postCodeValidator]],
      country: [this.countries[0], [Validators.required]]
    });
    if (this.customer)
    {
      this.addEditCustomerForm.patchValue({
        type: this.customer.type === '' ? this.types[0] : this.customer.type,
        fullName: this.customer.fullName,
        phone: this.customer.phone,
        email: this.customer.email,
        address: this.customer.address,
        postcode: this.customer.postcode,
        country: this.customer.country === '' ? this.countries[0] : this.customer.country
      });
    }


  }

  onAddEdit() {
    if (this.mode === ADD_CUSTOMER_MODE)
    {
      this.addCustomer();
    } else
    {
      this.editCustomer();
    }
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

  onCancel() {
    this.closeDialog.next('closeDialog');
  }

  onSelectionChange(event, controlName) {
    this.addEditCustomerForm.get(controlName).setValue(event.value);
    this.addEditCustomerForm.get(controlName).markAsDirty();
  }

  validateFormControl(fControlName: string) {
    const fControl = this.addEditCustomerForm.get(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(value => {
        this.formValidationMap[fControlName] = this.validationService.setMessage(fControl, fControlName);
      });
  }

  getAddressByPostcode() {
    const postcodeFormControl = this.getFormAttribute('postcode');
    if (!postcodeFormControl.invalid)
    {
      this.addresses = this.commonService.getAddressesByPostcode(postcodeFormControl.value);
      return this.addresses;
    }
  }

  getCustomerAttributes(): ICustomer {
   return  {
      uuid: '',
      fullName: this.getFormAttribute('fullName').value,
      address: this.getFormAttribute('address').value,
      postcode: this.getFormAttribute('postcode').value,
      phone: this.getFormAttribute('phone').value,
      email: this.getFormAttribute('email').value,
      country: this.getFormAttribute('country').value,
      type: this.getFormAttribute('type').value,
      destination: ''
    };
  }

  getFormAttribute(fControlName: string) {
    return this.addEditCustomerForm.get(fControlName);
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

   ngOnDestroy() {
  //  this.createCustomer.unsubscribe();
  }

}
