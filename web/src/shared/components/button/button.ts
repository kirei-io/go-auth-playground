import { Component, input, output } from "@angular/core";

@Component({
    selector: 'button[app-button]',
    templateUrl: './button.html',
    styleUrl: './button.scss',
    host: {
        'class': 'app-button',
        '[disabled]': 'disabled()',
        '(click)': 'handleClick($event)'
    }
})
export class ButtonComponent {
    public readonly disabled = input<boolean>(false);
    public readonly buttonType = input<'button' | 'submit' | 'reset'>('button')

    public readonly btnClick = output<MouseEvent>()

    public handleClick(event: MouseEvent): void {
        if (!this.disabled()) {
            this.btnClick.emit(event)
        }
    }
}
