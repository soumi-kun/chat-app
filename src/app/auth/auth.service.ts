import { Injectable } from "@angular/core";
import { WebSocketService } from "../shared/services/web-socket.service";
import { Router } from "@angular/router";
import { User } from "../shared/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    constructor(public webSocketService: WebSocketService,
        public router: Router
    ){
        let tempUserId = localStorage.getItem('userId') || '';
        if(tempUserId){
            if(this.webSocketService.hubConnection?.state == 'Connected'){
                this.reauthMeListener();
                this.reauthMe(tempUserId);
            }
            else{
                this.webSocketService.ssObs().subscribe((obj: any) => {
                    if(obj.type == 'HubConnStarted'){
                        this.reauthMeListener();
                        this.reauthMe(tempUserId);
                    }
                });
            }
        }

    }
    public isAuthenticated: boolean = false;

    async authMe(user: string, password: string){
        let userInfo = {
            username: user, 
            password: password
        };
    
        await this.webSocketService.hubConnection.invoke("AuthMe", userInfo)
            .finally(() =>{
            })
            .catch(err => console.error(err));
    }
    
    authMeListenerSuccess(){
        this.webSocketService.hubConnection.on("authMeResponseSuccess", (user: User) => {
          console.log(user);

          localStorage.setItem('userId', user.id);
          this.webSocketService.userData = {...user};
          this.isAuthenticated = true;

          this.webSocketService.toastr.success("Login Successful");
          this.webSocketService.router.navigateByUrl('/home');
        });
      }
    
    authMeListenerFail(){
        this.webSocketService.hubConnection.on('authMeResponseFail', ()=> {
            this.webSocketService.toastr.error("incorrect credentials!");
        });
    }

    async reauthMe(userId: string){
        await this.webSocketService.hubConnection.invoke('ReauthMe', userId)
        .then()
        .catch(err => console.error(err));
    }

    reauthMeListener(){
        this.webSocketService.hubConnection.on('reauthMeResponse', (user: User) => {
            console.log(user);
            this.webSocketService.userData = {...user};
            this.isAuthenticated = true;
            this.webSocketService.toastr.success('Reauthenticated!');
            if(this.webSocketService.router.url == '/auth'){
                this.webSocketService.router.navigateByUrl('/home');
            }
        })
    }

}