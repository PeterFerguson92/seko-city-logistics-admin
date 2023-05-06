import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { REDIRECT_SECTION_AFTER_LOGIN } from '../constants';
import { ValidationService } from '../service/validation/validation.service';
import { CommonService } from '../service/common.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
    authForm: FormGroup;
    showErrorText: boolean;
    showLoader: boolean;
    errorText: string;

    formValidationMap = {
        usernameInput: '',
        passwordInput: '',
    };

    componentDestroyed$: Subject<boolean> = new Subject();

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private validationService: ValidationService,
        private commonService: CommonService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.authForm = this.formBuilder.group({
            usernameInput: ['', [Validators.required]],
            passwordInput: ['', [Validators.required]],
        });

        this.validateFormControl('usernameInput');
        this.validateFormControl('passwordInput');
    }

    getFormControl(fControlName: string) {
        return this.authForm.get(fControlName);
    }

    onAuthenticate() {
        this.spinner.show();
        this.showErrorText = false;
        const authenticationMode = 'login';
        this.authService
            .login(this.authForm.get('usernameInput').value, this.authForm.get('passwordInput').value)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(
                ({ data }) => {
                    if (data[authenticationMode].result) {
                        this.encript(
                            data[authenticationMode].userData.sub,
                            this.authForm.get('usernameInput').value
                        );
                    } else {
                        this.showErrorText = true;
                        this.errorText = data[authenticationMode].errors[0].message;
                        this.clearFields();
                        this.clearNotification();
                    }
                    this.spinner.hide();
                },
                (error) => {
                    this.showErrorText = true;
                    this.errorText = 'Something went wrong, Please contact support';
                    this.clearFields();
                    this.clearNotification();
                }
            );
    }

    encript(sub, username) {
        this.commonService
            .getKeys()
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(
                ({ data }) => {
                    const encrypted = this.commonService.encryptMessage(sub, data.getKeys.encryptionKey);
                    const encryptedKey = this.commonService.encryptMessage(username, data.getKeys.encryptionKey);
                    localStorage.setItem('id', encrypted);
                    localStorage.setItem('key', encryptedKey);
                    this.showLoader = false;

                    this.router.navigate([`/${REDIRECT_SECTION_AFTER_LOGIN}`]);
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    validateFormControl(fControlName: string) {
        const fControl = this.authForm.get(fControlName);
        this.validationService
            .watchAndValidateFormControl(fControl)
            .subscribe(
                (value) =>
                    (this.formValidationMap[fControlName] = this.validationService.getValidationMessage(
                        fControl,
                        fControlName
                    ))
            );
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }

    clearNotification() {
        setTimeout(
            function () {
                this.showErrorText = false;
                this.errorText = null;
            }.bind(this),
            3000
        );
    }

    clearFields() {
        this.getFormControl('usernameInput').reset();
        this.getFormControl('passwordInput').reset();
    }
}
