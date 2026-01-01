import { Component, inject, OnInit, signal } from "@angular/core";
import { UserSerivce } from "../../shared/services/user";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-profile",
    templateUrl: './profile.html',
    imports: [CommonModule]
})
export class ProfilePage implements OnInit {
    userService = inject(UserSerivce)
    user = signal<unknown>(null)

    ngOnInit(): void {

    }
}
