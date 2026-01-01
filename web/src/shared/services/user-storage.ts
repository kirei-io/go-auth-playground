import { Injectable, inject, signal, computed } from "@angular/core";
import { LocalStorageService } from "./localstorage";

type User = unknown

export interface AuthState {
    user: User | null;
    isAuth: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
    private storage = inject(LocalStorageService);
    private readonly CACHE_KEY = 'user_state';
    private readonly TTL = 30 * 60 * 1000; // 30 min

    private state = signal<AuthState>(this.loadFromCache());

    public user = computed(() => this.state().user);
    public isAuth = computed(() => this.state().isAuth);

    public setAuthenticated(user: User) {
        const newState = { user, isAuth: true };
        this.state.set(newState);
        this.storage.setItem(this.CACHE_KEY, newState, this.TTL);
    }

    public setUnauthenticated() {
        this.state.set({ user: null, isAuth: false });
        this.storage.removeItem(this.CACHE_KEY);
    }

    private loadFromCache(): AuthState {
        const cached = this.storage.getItem<AuthState>(this.CACHE_KEY);
        return cached ?? { user: null, isAuth: false };
    }
}
