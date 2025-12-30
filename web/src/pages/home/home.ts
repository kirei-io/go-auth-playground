import { Component } from "@angular/core";
import { LoginFormComponent } from "../../features/login-form/login-form";

@Component({
    selector: "app-home",
    templateUrl: './home.html',
    imports: [LoginFormComponent]
})
export class HomePage {

}
