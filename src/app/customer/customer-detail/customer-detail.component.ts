import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ADD_CUSTOMER_MODE } from 'src/app/constants';
import { CommonService } from 'src/app/service/common.service';
import { ValidationService, postCodeValidator } from 'src/app/service/validation/validation.service';
import { ICustomer } from '../domain';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css', '../../shared/shared.css']
})
export class CustomerDetailComponent implements OnInit, AfterViewInit {
  @Input() customer: ICustomer;
  @Input() mode;

  titlePrefix = 'Add';
  buttonLabel;
  formValidationMap = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    postcode: '',
    country: ''
  };

  types = ['PERSONAL', 'BUSINESS', 'CHARITY'];
  countries = ['UNITED KINGDOM', 'GHANA'];
  addresses = [];
  addEditCustomerForm: FormGroup;
  buttonDisabled;


  constructor(private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private commonService: CommonService,
    private validationService: ValidationService) { }

  ngAfterViewInit(): void {
    this.validateFormControl('fullName');
    this.validateFormControl('phone');
    this.validateFormControl('email');
    this.validateFormControl('address');
    this.validateFormControl('postcode');
  }

  ngOnInit(): void {
    this.setLabels();
    this.addEditCustomerForm = this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      postcode: ['', [Validators.required, postCodeValidator]],
      country: [this.countries[0], [Validators.required]]
    });
    if (this.customer)
    {
      this.addEditCustomerForm.patchValue({
        type: this.customer.type,
        fullName: this.customer.fullName,
        phone: this.customer.phone,
        email: this.customer.email,
        address: this.customer.address,
        postcode: this.customer.postcode,
        country: this.customer.country
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
    this.customersService.createCustomer(this.getCustomerAttributes()).subscribe(
      ({ data }) => {
        location.reload();  // To handle properly
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
          location.reload();  // To handle properly
        },
        error => {
          console.log(error);
        }
      );
    }
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

  setLabels() {
    if (this.mode === ADD_CUSTOMER_MODE)
    {
      this.titlePrefix = 'Add';
      this.buttonLabel = 'ADD'
    } else
    {
      this.titlePrefix = 'Edit';
      this.buttonLabel = 'UPDATE'
    }
  }

    // TODO find a way to proper handle enable/disable of button, at the moment it's enabled when a value is changed,
    // to find a way to enable when the value have actually changed
   isDisabled() {
    if (this.mode === ADD_CUSTOMER_MODE)
    {
      this.buttonDisabled = !this.addEditCustomerForm.valid;
    } else
    {
      return this.addEditCustomerForm.pristine || !this.addEditCustomerForm.valid;
    }
  }
}
