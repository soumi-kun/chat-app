import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/services/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  username: string = '';

  selectedChatType: 'private' | 'group' | null = null;
  recipientUsername: string = '';
  groupName: string = '';

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    // this.webSocketService.getNewMessage().subscribe((messages) => {
    //   this.messages.push(messages);
    // });
    this.webSocketService.startConnection();

    setTimeout(() => {
      this.webSocketService.askServer();
      this.webSocketService.askServerListener();
    }, 2000);
  }
  ngOnDestroy(): void {
    this.webSocketService.hubConnection.off('askServerResponse');
  }

  // sendMessage(){
  //   if(this.newMessage.trim() !== ''){
  //     if(this.selectedChatType === 'private'){
  //       this.webSocketService.sendPrivateMessage({sender: this.username, recipient: this.recipientUsername, content: this.newMessage});
  //     }
  //     else if(this.selectedChatType === 'group'){
  //       this.webSocketService.sendGroupMessage({sender: this.username, group: this.groupName, content: this.newMessage});
  //     }
  //     this.newMessage = '';
  //   }
  // }

}
