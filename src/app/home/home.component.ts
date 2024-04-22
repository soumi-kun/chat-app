import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/services/web-socket.service';
import { User } from '../shared/models/user.model';
import { Msgs } from '../shared/models/message.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users: Array<User> = new Array<User>();
  selectedUser: User = {
    id: '',
    name: '',
    password: '',
    signalrId: '',
    username: '',
    msgs: []
  };
  msg: string = '';
  constructor(public webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.userOnListener();
    this.userOffListener();
    this.logoutListener();
    this.getOnlineUsersListener();
    this.sendMsgInv();
    this.sendMsgLis();

    //check if hub connection state is connected
    if(this.webSocketService.hubConnection?.state == 'Connected'){
      this.getOnlineUsersInvoker();
    }
    else{
        this.webSocketService.ssObs().subscribe((obj: any) => {
            if(obj.type == 'HubConnStarted'){
                this.getOnlineUsersInvoker();
            }
        });
    }
  }

  logout(){
    this.webSocketService.hubConnection.invoke("Logout",this.webSocketService.userData.id)
    .catch(err => console.error(err));
  }

  logoutListener(){
    this.webSocketService.hubConnection.on('logoutResponse', () =>{
      localStorage.removeItem('userId');
      location.reload();
    })
  }

  userOnListener(){
    this.webSocketService.hubConnection.on('userOn', (newUser: User) => {
      console.log(newUser);
      this.users.push(newUser);
    });
  }

  userOffListener(){
    this.webSocketService.hubConnection.on('userOff', (userId: string) => {
      this.users = this.users.filter(u => u.id != userId);
    })
  }

  getOnlineUsersInvoker(){
    this.webSocketService.hubConnection.invoke('GetOnlineUsers')
    .catch(err => console.error(err));
  }

  getOnlineUsersListener(){
    this.webSocketService.hubConnection.on('getOnlineUserResponse', (onlineUsers: Array<User>) => {
      this.users = [...onlineUsers];
    });
  }

  sendMsgInv(){
    if(this.msg?.trim() === '' || this.msg == null){
      return;
    }
    this.webSocketService.hubConnection.invoke('SendMsg', this.selectedUser.signalrId, this.msg)
    .catch(err => console.error(err));

    if(this.selectedUser.msgs == null){
      this.selectedUser.msgs = [];
    }
    let msgs: Msgs = {
      content: this.msg,
      mine: true,
      id: '',
      senderId: '',
      receiverId: ''    
    };
    this.selectedUser.msgs.push(msgs);
    this.msg = '';
  }

  sendMsgLis(){
    this.webSocketService.hubConnection.on('sendMsgResponse', (signalrId: string, message: string) => {
      let receiver = this.users.find(u => u.signalrId === signalrId);
      if(receiver?.id){
        console.log("message received");
        let msg: Msgs={
          content: message,
          mine: false,
          id: '',
          senderId: '',
          receiverId: ''
        };
        this.selectedUser.msgs.push(msg);  
      }
    });
  }

}
