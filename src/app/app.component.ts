import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from './shared/services/web-socket.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'chat-app';
  constructor(public webSocketService: WebSocketService, 
    public authService: AuthService
  ){

  }

  ngOnInit(){
    this.webSocketService.startConnection();
  }

  ngOnDestroy(){
    this.webSocketService.hubConnection.off('askServerResponse');
  }
}
