import { inject, Injectable } from "@angular/core";
import { WINDOW } from "../tokens/window";
import { filter, fromEvent, map, merge, Observable, startWith, Subject } from "rxjs";

export type TCacheContainer<T> = {
    value: T
    expiry: number
}

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private window = inject(WINDOW)
    private storage = this.window.localStorage;
    private readonly prefix = "GAP_"
    private storageChanges$ = new Subject<{ key: string, value: string | null }>();


    public setItem<T>(key: string, value: T, ttl?: number): void {
        let dataToSave: string;

        if (ttl) {
            const container = {
                value,
                expiry: Date.now() + ttl
            } satisfies TCacheContainer<T>

            dataToSave = JSON.stringify(container)
        } else {
            dataToSave = typeof value === 'string' ? value : JSON.stringify(value)
        }

        this.storage.setItem(this.getPrefixedKey(key), dataToSave)
        this.storageChanges$.next({ key: this.getPrefixedKey(key), value: dataToSave })
    }

    public getItem<T>(key: string): T | null {
        const rawData = this.storage.getItem(this.getPrefixedKey(key))

        if (!rawData) {
            return null;
        }

        try {
            const data = JSON.parse(rawData)

            if (data && typeof data === 'object' && 'expiry' in data && 'value' in data) {
                const container = data as TCacheContainer<T>

                if (Date.now() > container.expiry) {
                    this.removeItem(key)
                    return null
                }

                return container.value
            }
            return data as T
        } catch (error) {
            return rawData as unknown as T
        }
    }

    public removeItem(key: string): void {
        this.storage.removeItem(this.getPrefixedKey(key))
    }

    public clear(): void {
        Object.keys(this.storage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(key => this.storage.removeItem(key));
    }

    public watch(key: string): Observable<string | null> {
        const prefixedKey = this.getPrefixedKey(key);
        return merge(
            fromEvent<StorageEvent>(this.window, 'storage').pipe(
                filter((event) => event.key === prefixedKey),
                map(((event) => event.newValue)),
            ),
            this.storageChanges$.pipe(
                filter((change) => change.key === prefixedKey),
                map((change) => change.value)
            ).pipe(
                startWith(this.getItem(key))
            )
        )
    }
    public clearExpired(): void {
        Object.keys(this.storage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(prefixedKey => {
                const key = prefixedKey.replace(this.prefix, '');
                this.getItem(key);
            });
    }

    private getPrefixedKey(key: string): string {
        return `${this.prefix}${key}`
    }
}
