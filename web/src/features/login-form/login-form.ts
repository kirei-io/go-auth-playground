import { Component, inject, signal } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormComponent } from "../../shared/components/form/form";
import { InputComponent } from "../../shared/components/input/input";
@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.html',
    imports: [FormComponent, InputComponent, ReactiveFormsModule]
})
export class LoginFormComponent {
    private readonly fb = inject(NonNullableFormBuilder)

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

    public async onLogin(): Promise<void> {
        if (this.loginForm.invalid) {
            return
        }

        this.isLoading.set(true)
        const credentials = this.loginForm.getRawValue()

        console.log('login form', credentials)

        setTimeout(() => {
            this.isLoading.set(false)
        }, 2000)
    }
}
