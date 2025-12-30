import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ButtonComponent } from "../button/button";

@Component({
    selector: 'app-form',
    templateUrl: './form.html',
    styleUrl: './form.scss',
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent]
})
export class FormComponent<TControl extends { [K in keyof TControl]: AbstractControl<any>; }> {
    public readonly formGroup = input.required<FormGroup<TControl>>();
    public readonly title = input<string>("")
    public readonly submitLabel = input<string>('')
    public readonly submitted = output<void>()

    public onSubmit(): void {
        if(this.formGroup().valid) {
            this.submitted.emit()
        }
    }
}
