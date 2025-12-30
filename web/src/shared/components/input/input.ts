import { Component, computed, input, Optional, Self, signal } from "@angular/core";
import { ControlValueAccessor, FormControl, NgControl } from "@angular/forms";

@Component({
    selector: 'app-input',
    templateUrl: './input.html',
    styleUrl: './input.scss',
    host: {
        'class': 'input-wrapper'
    }
})
export class InputComponent implements ControlValueAccessor {
    public readonly label = input<string>('');
    public readonly inputType = input<string>("text")
    public readonly placeholder = input<string>("text")
    public readonly name = input.required<string>()
    public readonly errorsMap = input<Record<string, string>>({});
    public readonly control = computed(() => this.controlDir?.control || null);

    public isDisabled = signal(false);

    private onChange: (value: string) => void = () => {};
    private onTouched: () => void = () => {};

    public constructor(@Self() @Optional() public readonly controlDir: NgControl) {
        if (this.controlDir) {
            this.controlDir.valueAccessor = this
        }
    }

    public get errorKeys(): string[] {
        const errors = this.controlDir?.control?.errors;
        return errors ? Object.keys(errors) : [];
    }

    public writeValue(value: string): void {

    }
    public registerOnChange(fn: any): void {
        this.onChange = fn
    }
    public registerOnTouched(fn: any): void {
        this.onTouched = fn
    }
    public onInputChange(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.onChange(value);
    }

    public onBlur(): void {
        this.onTouched();
    }

    public setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }
}
