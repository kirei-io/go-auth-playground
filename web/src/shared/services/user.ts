import { HttpClient, HttpHeaders, httpResource, HttpResourceRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserSerivce {
    private baseURL = 'http://localhost:8080'
    private http = inject(HttpClient)

    public getSelf(): Observable<unknown> {
        const url = new URL('/api/v1/auth/self', this.baseURL).toString()
        return this.http.get(url)
    }
}
