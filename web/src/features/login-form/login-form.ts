import { Component, inject, resource, Signal, signal } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormComponent } from "../../shared/components/form/form";
import { InputComponent } from "../../shared/components/input/input";
import { catchError, of } from "rxjs";
import { AUTH_STRATEGY, AuthConfigService, TStrategy } from "../../shared/services/auth";
@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.html',
    imports: [FormComponent, InputComponent, ReactiveFormsModule]
})
export class LoginFormComponent {
    private readonly fb = inject(NonNullableFormBuilder)
    private readonly authService = inject(AUTH_STRATEGY)
    private readonly authConfigService = inject(AuthConfigService)

    public readonly isLoading = signal(false)

    public readonly loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    })

    public readonly emailErrors = {
        'required': 'Enter email address',
        'email': 'Incorrect email'
    }

    public readonly passwordErrors = {
        'required': 'Password is required',
        'minLength': 'Password should be more 6 chars'
    }

    public get strategy(): Signal<TStrategy> {
        return this.authConfigService.authStrategy
    }

    public async onLogin(): Promise<void> {
        if (this.loginForm.invalid) {
            return
        }
        this.isLoading.set(true)
        const credentials = this.loginForm.getRawValue()


        this.authService.login(credentials).pipe(
            catchError((err => of(err)))).subscribe(console.log)
        this.isLoading.set(false)
    }
}
