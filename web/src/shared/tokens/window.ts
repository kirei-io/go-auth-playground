import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('Global Window object', {
    factory: () => window
});
