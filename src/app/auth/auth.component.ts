import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/services/web-socket.service';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(public webSocketService: WebSocketService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    //this.webSocketService.startConnection();
    this.authService.authMeListenerSuccess();
    this.authService.authMeListenerFail();
  }

  ngOnDestroy(){
    this.webSocketService.hubConnection.off("authMeResponseSuccess");
    this.webSocketService.hubConnection.off("authMeResponseFail");
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    this.authService.authMe(form.value.userName, form.value.password);
    form.reset();
  }

  

}
