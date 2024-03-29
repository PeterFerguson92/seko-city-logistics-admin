import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { COUNTRIES, COUNTRY_CODES } from 'src/app/constants';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { ValidationService } from 'src/app/service/validation/validation.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css', '../../shared/shared-new-form.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
    PASSWORD_MANAGEMENT_FIELDS = [
        'oldPassword',
        'newPassword',
        'confirmNewPassword',
        'verificationCode',
        'resetNewPassword',
        'confirmResetNewPassword',
    ];

    user;
    showChangedPasswordFields = false;
    showResetPasswordFields = false;
    showPasswordMgmtButton = false;
    showErrorText: boolean;
    errorText: string;
    showErrorText2: boolean;
    errorText2: string;
    showConfirmText: boolean;
    confirmText: string;
    showInfoText: boolean;
    infoText: string;

    profileForm: FormGroup;
    passwordMgmtForm: FormGroup;
    countries = COUNTRIES;
    countryCodes = COUNTRY_CODES;
    formValidationMap = {
        name: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        country: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        verificationCode: '',
        resetNewPassword: '',
        confirmResetNewPassword: '',
    };

    componentDestroyed$: Subject<boolean> = new Subject();

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.spinner.show();
        this.profileForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            username: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.email]],
            phoneGroup: this.formBuilder.group(
                {
                    countryCode: [this.countryCodes[0], [Validators.required]],
                    phone: ['', [Validators.required]],
                },
                { validators: [Validators.required, this.validationService.phoneValidator] }
            ),
            country: [this.countries[0], [Validators.required]],
        });

        this.passwordMgmtForm = this.formBuilder.group({
            oldPassword: [null, [Validators.required]],
            newPassword: [null, [Validators.required]],
            confirmNewPassword: [null, [Validators.required]],
            verificationCode: [null, [Validators.required]],
            resetNewPassword: [null, [Validators.required]],
            confirmResetNewPassword: [null, [Validators.required]],
        });

        const encryptedId = localStorage.getItem('id');
        if (encryptedId) {
            this.getData(encryptedId);
        }
    }

    getData(sub) {
        this.authService
            .getUser(sub)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(
                ({ data }) => {
                    if (data.getUser.result && data.getUser.users[0]) {
                        this.user = data.getUser.users[0];
                        this.buildFormGroup(this.user);
                        this.spinner.hide();
                    } else {
                        this.showErrorText2 = true;
                        this.errorText2 = 'Something went wrong, Please contact support';
                        this.spinner.hide();
                    }
                },
                (error) => {
                    console.log(error);
                    this.showErrorText2 = true;
                    this.errorText2 = 'Something went wrong, Please contact support';
                    this.spinner.hide();
                }
            );
    }

    ngAfterViewInit(): void {
        this.validateFormControl('name');
        this.validateFormControl('lastName');
        this.validateFormControl('oldPassword');
        this.validateFormControl('newPassword');
        this.validateFormControl('resetNewPassword');
        this.validateFormControl('confirmResetNewPassword');
        this.validateFormControl('verificationCode');
        this.validateGroupFormControl('phoneGroup', 'phone');
    }

    buildFormGroup(userData) {
        console.log(userData);
        const phoneNumberData = this.splitPhoneNumber(userData.phoneNumber);
        this.profileForm.controls.name.setValue(userData.name);
        this.profileForm.controls.lastName.setValue(userData.lastName);
        this.profileForm.controls.username.setValue(userData.username);
        this.profileForm.controls.email.setValue(userData.email);
        this.profileForm.controls.phoneGroup.get('countryCode').setValue(phoneNumberData.countryCode);
        this.profileForm.controls.phoneGroup.get('phone').setValue(phoneNumberData.number);
        this.profileForm.controls.country.setValue(userData.country);

        this.profileForm.get('username').disable();
        this.profileForm.get('email').disable();
        this.spinner.hide();
    }

    validateFormControl(fControlName: string) {
        const fControl = this.getFormControl(fControlName);
        this.validationService.watchAndValidateFormControl(fControl).subscribe(() => {
            this.formValidationMap[fControlName] = this.validationService.getValidationMessage(
                fControl,
                fControlName
            );
        });
    }

    validateGroupFormControl(formGroupName: string, fControlName: string) {
        const fGroup = this.profileForm.get(formGroupName);
        const fMainControl = fGroup.get(fControlName);
        this.validationService.watchAndValidateFormControl(fGroup).subscribe(() => {
            this.formValidationMap.phone = this.validationService.getGroupValidationMessage(
                fGroup,
                fMainControl,
                fControlName
            );
            if (fGroup.dirty && !fGroup.valid) {
                fMainControl.markAsDirty();
                fMainControl.setErrors({ phone: 'Phone number' });
            } else {
                fGroup.setErrors(null);
            }
        });
    }

    getFormControl(fControlName: string) {
        if (this.PASSWORD_MANAGEMENT_FIELDS.includes(fControlName)) {
            return this.passwordMgmtForm.get(fControlName);
        } else {
            return fControlName === 'phone' || fControlName === 'countryCode'
                ? this.profileForm.get('phoneGroup').get(fControlName)
                : this.profileForm.get(fControlName);
        }
    }

    onSelectionChange(event: any, formControlName) {
        const fControl = this.getFormControl(formControlName);
        fControl.setValue(event.value);
        fControl.markAsDirty();
    }

    getPhoneNumber() {
        return this.getFormControl('countryCode').value + this.getFormControl('phone').value;
    }

    splitPhoneNumber(phoneNumber) {
        return { countryCode: phoneNumber.substring(0, 3), number: phoneNumber.substring(3, phoneNumber.length) };
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }

    isDisabled() {
        return !this.profileForm.valid;
    }

    onChangePassword() {
        this.showPasswordMgmtButton = true;
        this.showChangedPasswordFields = true;
        this.showResetPasswordFields = false;
    }

    onResetPassword() {
        this.showPasswordMgmtButton = true;
        this.showChangedPasswordFields = false;
        this.showResetPasswordFields = true;
        this.onRequestResetPassword();
    }

    onRequestResetPassword() {
        const username = this.getFormControl('username').value;
        this.spinner.show();
        this.authService
            .resetPassword(username)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(
                ({ data }) => {
                    if (data.resetPassword.result) {
                        this.showInfoText = true;
                        this.infoText =
                            'A verification code has been sent to your email. Please use that to reset your password';
                        this.clearNotification();
                    } else {
                        this.showErrorText = true;
                        this.errorText = data.resetPassword.errors[0].message;
                        this.clearFields();
                        this.clearNotification();
                    }
                    this.spinner.hide();
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    onUpdateDriver() {
        const updateDriverFields = [];
        Object.keys(this.profileForm.controls).forEach((key) => {
            const formControl = this.profileForm.controls[key];

            if (!formControl.pristine && formControl.value !== this.user[key]) {
                if (key === 'phoneGroup') {
                    const countryCodeFormControl = this.getFormControl('countryCode');
                    const numberFormControl = this.getFormControl('number');
                    if (countryCodeFormControl.pristine || numberFormControl.pristine) {
                        updateDriverFields.push({ name: 'phoneNumber', value: this.getPhoneNumber() });
                    }
                } else {
                    updateDriverFields.push({ name: key, value: formControl.value });
                }
            }
        });

        if (updateDriverFields.length > 0) {
            this.authService.updateUser(this.getFormControl('username').value, updateDriverFields).subscribe(
                ({ data }) => {
                    this.router.navigate(['/profile']).then(() => {
                        window.location.reload();
                    });
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    isSubmitDisabled() {
        if (this.showChangedPasswordFields) {
            return (
                !this.getFormControl('oldPassword').valid &&
                !this.getFormControl('newPassword').valid &&
                !this.getFormControl('confirmNewPassword').valid
            );
        } else {
            return (
                !this.getFormControl('confirmResetNewPassword').valid &&
                !this.getFormControl('verificationCode').valid
            );
        }
    }

    onSubmit() {
        if (this.showChangedPasswordFields) {
            this.changePassword();
        } else {
            this.resetPassword();
        }
    }

    changePassword() {
        const username = this.getFormControl('username').value;
        const oldPassword = this.getFormControl('oldPassword').value;
        const newPassword = this.getFormControl('newPassword').value;
        const confirmNewPassword = this.getFormControl('confirmNewPassword').value;

        if (newPassword === confirmNewPassword) {
            this.spinner.show();
            this.authService
                .changePassword(username, oldPassword, newPassword)
                .pipe(takeUntil(this.componentDestroyed$))
                .subscribe(
                    ({ data }) => {
                        if (data.changePassword.result) {
                            this.showErrorText = false;
                            this.errorText = null;

                            this.showConfirmText = true;
                            this.confirmText = 'Password changed sucessfully';

                            this.clearFields();
                            this.clearNotification();
                        } else {
                            this.showErrorText = true;
                            this.errorText = data.changePassword.errors[0].message;
                            this.clearFields();
                            this.clearNotification();
                        }
                        this.spinner.hide();
                    },
                    (error) => {
                        this.showErrorText = true;
                        this.errorText = 'Something went wrong, Please contact support';
                        this.spinner.hide();
                    }
                );
        } else {
            this.showErrorText = true;
            this.errorText = 'Passwords do not match';
            this.clearNotification();
        }
    }

    resetPassword() {
        const username = this.getFormControl('username').value;
        const verificationCode = this.getFormControl('verificationCode').value;
        const resetNewPassword = this.getFormControl('resetNewPassword').value;
        const confirmResetNewPassword = this.getFormControl('confirmResetNewPassword').value;

        if (resetNewPassword === confirmResetNewPassword) {
            this.spinner.show();
            this.authService
                .confirmResetPassword(username, verificationCode, confirmResetNewPassword)
                .pipe(takeUntil(this.componentDestroyed$))
                .subscribe(
                    ({ data }) => {
                        if (data.confirmResetPassword.result) {
                            this.showErrorText = false;
                            this.errorText = null;

                            this.showConfirmText = true;
                            this.confirmText = 'Password changed sucessfully';

                            this.clearFields();
                            this.clearNotification();
                        } else {
                            this.showErrorText = true;
                            this.errorText = data.confirmResetPassword.errors[0].message;
                            this.clearFields();
                            this.clearNotification();
                        }
                        this.spinner.hide();
                    },
                    (error) => {
                        this.showErrorText = true;
                        this.errorText = 'Something went wrong, Please contact support';
                        this.spinner.hide();
                    }
                );
            this.spinner.hide();
        } else {
            this.showErrorText = true;
            this.errorText = 'Passwords do not match';
            this.clearNotification();
        }
    }

    clearNotification() {
        setTimeout(
            function () {
                this.showConfirmText = false;
                this.showErrorText = false;
                this.showInfoText = false;

                this.confirmText = null;
                this.errorText = null;
                this.showInfoText = null;
            }.bind(this),
            3000
        );
    }

    clearFields() {
        this.getFormControl('oldPassword').reset();
        this.getFormControl('newPassword').reset();
        this.getFormControl('verificationCode').reset();
        this.getFormControl('resetNewPassword').reset();
        this.getFormControl('confirmResetNewPassword').reset();
    }
}
