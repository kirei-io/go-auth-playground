import { HttpClient, HttpHeaders, httpResource, HttpResourceRequest } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserSerivce {
    public currentUser = signal<any | null>(null);

    setAuthenticated(user: any) {
        this.currentUser.set(user);
    }

    setUnauthenticated() {
        this.currentUser.set(null);
    }
}
