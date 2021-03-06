import {Component, OnInit} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
    ValidationErrors, FormGroupDirective, NgForm
} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {InfoDialogComponent} from '../../../shared/components/error-dialog/info-dialog.component';
import {RedirectDataService} from '../../../shared/services/redirect-data.service';
import {AccountService} from '../../services/account/account.service';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.touched && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.touched && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public signupForm: FormGroup;
    public errorMatcher: CustomErrorStateMatcher;

    static passwordConfirmValidation(fg: FormGroup): ValidationErrors | null {
        const password = fg.get('password').value;
        const confirmPassword = fg.get('confirmPassword').value;
        return (password !== null && confirmPassword !== null && password === confirmPassword) ? null : {passwordMismatch: true};
    }

    constructor(public auth: AuthService, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog,
                private accountService: AccountService, private redirectDataService: RedirectDataService) {
    }

    ngOnInit(): void {
        this.errorMatcher = new CustomErrorStateMatcher();

        this.loginForm = new FormGroup({
            email: new FormControl('', [
                Validators.required,
                Validators.email
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ])
        });

        this.signupForm = new FormGroup({
            email: new FormControl('', [
                Validators.required,
                Validators.email
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ]),
            confirmPassword: new FormControl('')
        }, {validators: LoginComponent.passwordConfirmValidation});

        this.redirectDataService.reset();
    }

    get emailLogin(): AbstractControl {
        return this.loginForm.get('email');
    }

    get passwordLogin(): AbstractControl {
        return this.loginForm.get('password');
    }

    get emailSignup(): AbstractControl {
        return this.signupForm.get('email');
    }

    get passwordSignup(): AbstractControl {
        return this.signupForm.get('password');
    }

    get confirmPasswordSignup(): AbstractControl {
        return this.signupForm.get('confirmPassword');
    }

    public loginEmailPassword(): void {
        const email: string = this.emailLogin.value;
        const password: string = this.passwordLogin.value;

        this.auth.loginFirebaseEmailPassword(email, password).then(cred => {
            this.auth.firebaseAuth.currentUser.then(user => {
                if (user.emailVerified) {
                    this.redirectDataService.data.checkCreateUserBackend = true;
                    this.redirectDataService.persistToLocalStorage();

                    this.router.navigate(['watchlist']);
                } else {
                    this.router.navigate(['verifyEmail']);
                }
            });
        }).catch(err =>
            this.dialog.open(InfoDialogComponent, {
                data: {
                    title: 'Error',
                    text: 'Invalid login credentials. Either your email or password are wrong.'
                }
            })
        );
    }

    public loginGoogle(): void {
        this.redirectDataService.data.checkCreateUserBackend = true;
        this.redirectDataService.persistToLocalStorage();

        this.auth.loginFirebaseGoogle().then(val =>
            this.router.navigate(['watchlist'])
        );
    }

    public loginMicrosoft(): void {
        this.redirectDataService.data.checkCreateUserBackend = true;
        this.redirectDataService.persistToLocalStorage();

        this.auth.loginFirebaseMicrosoft().then(val =>
            this.router.navigate(['watchlist'])
        );
    }

    public signUp(): void {
        const email = this.emailSignup.value;
        const password = this.passwordSignup.value;

        this.auth.createAccount(email, password).then(val =>
            this.auth.firebaseAuth.currentUser.then(user => {
                user.sendEmailVerification().then(() =>
                    this.router.navigate(['verifyEmail'])
                );
            })
        ).catch(err =>
            this.dialog.open(InfoDialogComponent, {
                data: {
                    title: 'Error',
                    text: `Invalid login credentials. Either your email or password are wrong.\n${err}`
                }
            })
        );
    }
}
