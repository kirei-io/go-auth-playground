import { Injectable, Signal, signal } from "@angular/core";

export const STRATEGY_TYPE = {
    LOCALSTORAGE: 'localstorage',
    COOKIE: 'cookie'
} as const

export type TStrategy = typeof STRATEGY_TYPE[keyof typeof STRATEGY_TYPE]

@Injectable({
    providedIn: 'root'
})
export class AuthConfigService {
    private currentStrategy = signal<TStrategy>(STRATEGY_TYPE.LOCALSTORAGE)

    public selectStrategy(strategy: TStrategy) {
        this.currentStrategy.set(strategy)
    }

    public get authStrategy(): Signal<TStrategy> {
        return this.currentStrategy.asReadonly()
    }
}
