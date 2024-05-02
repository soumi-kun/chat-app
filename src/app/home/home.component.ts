import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from '../shared/services/web-socket.service';
import { User } from '../shared/models/user.model';
import { Msgs } from '../shared/models/message.model';
import { ChatHistoryDatePipe } from './chat-history-date.Pipe';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users: Array<User> = [];
  selectedUser: User = {
    id: '',
    name: '',
    password: '',
    signalrId: '',
    username: '',
    msgs: []
  };
  msg: string = '';
  constructor(public webSocketService: WebSocketService, public chatHistoryDatePipe: ChatHistoryDatePipe, private cdr: ChangeDetectorRef) { }

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

  @ViewChild('msgBox') msgBox!: ElementRef;

  // Method to scroll to the bottom of the chat history
  scrollToBottom(): void {
    if (this.msgBox) {
      this.msgBox.nativeElement.scrollTop = this.msgBox.nativeElement.scrollHeight;
      this.cdr.detectChanges();
    }
  }

  isDropdownOpen: boolean = false;

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent click event from bubbling up to document
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectUser(user: User){
    if(user.id != null){
      console.log(user);
      this.selectedUser = user;
    }
  }

  getselectedUserMsgs(){
    if(this.selectedUser.id != null){
      return this.users.find(u => u.id == this.selectedUser.id)?.msgs;
    }
    return;
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
      this.users.push({
        id: newUser.id,
        name: newUser.name,
        password: '',
        signalrId: newUser.signalrId,
        username: newUser.username,
        msgs: []
      });
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
    const currentDate = new Date().toString();
    console.log(currentDate);
    let msgs: Msgs = {
      content: this.msg,
      mine: true,
      id: '',
      senderId: '',
      receiverId: '',
      timestamp: currentDate    
    };
    this.selectedUser.msgs.push(msgs);
    // this.users.find(u => u.id == this.selectedUser.id)?.msgs.push(msgs);
    this.msg = '';
    this.scrollToBottom();
  }

  sendMsgLis(){
    this.webSocketService.hubConnection.on('sendMsgResponse', (signalrId: string, message: string, timeStamp: Date, senderId: string) => {
      // let receiver = this.users.find(u => u.signalrId === signalrId);
      let receiver = this.users.find(u => u.id === senderId);
      if(receiver?.id){
        console.log("message received");
        let msg: Msgs={
          content: message,
          mine: false,
          id: '',
          senderId: '',
          receiverId: '',
          timestamp: timeStamp.toString()
        };
        this.selectedUser.msgs.push(msg);
        // this.users.find(u => u.id == senderId)?.msgs.push(msg);
        // console.log(this.users);
        // console.log(this.selectedUser);
        // console.log(signalrId);

        this.scrollToBottom();
      }
    });
  }

}
