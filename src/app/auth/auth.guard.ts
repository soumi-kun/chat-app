import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})

export class AuthGaurd implements CanActivate{
    constructor(public authService: AuthService){
    }
     canActivate(): boolean {
        if(!this.authService.isAuthenticated){
            this.authService.router.navigateByUrl("auth");
            return false;
        }
        return true;
     }
         
}
