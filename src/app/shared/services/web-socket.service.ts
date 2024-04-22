import { Content } from "@angular/compiler/src/render3/r3_ast";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { User } from "../models/user.model";
import { Msgs } from "../models/message.model";

@Injectable({
    providedIn: 'root'
})

export class WebSocketService{
    userData: User = {
        id: '',
        name: '',
        password: '',
        signalrId: '',
        username: '',
        msgs: []
    };
    hubConnection: HubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:5001/chathub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
    })
    .configureLogging(LogLevel.Information)
    .build();
    ssSubj = new Subject<any>();
    msgs: Array<Msgs> = [];



    private newMessageSubject: Subject<any> = new Subject<any>();
    private chatHistoryReceived: Subject<{senderId: string, Content: string}[]> = new Subject<{senderId: string, Content: string}[]>();

    constructor(public toastr:ToastrService, public router: Router){
        // this.hubConnection = new HubConnectionBuilder()
        //     .withUrl('https://localhost:5001/chathub')
        //     .configureLogging(LogLevel.Information)
        //     .build();

        // this.hubConnection.start()
        //     .then(() => console.log('connected to SignalR Hub'))
        //     .catch(err => console.error('Error whlile establishing connection to SignalR hub', err));
        
        // this.hubConnection.on('ReceiveMessage', (message) => {
        //     this.newMessageSubject.next(message);
        // });
    }

    startConnection(){
        this.hubConnection.start()
            .then(() => {
                console.log('connected to SignalR Hub');
                this.ssSubj.next({type: 'HubConnStarted'});
            })
            .catch(err => console.error('Error whlile establishing connection to SignalR hub', err));
    }

    ssObs(): Observable<any> {
        return this.ssSubj.asObservable();
    }

    askServer(){
        this.hubConnection.invoke('askServer', 'hey')
        .catch(err => console.error(err));
    }

    askServerListener(){
        this.hubConnection.on('askServerResponse', (text) =>{
            console.log(text);
            this.toastr.success(text);
            
        });
    }

    //old
    sendMessage(senderId: string, receiverId: string, message: string){
        this.hubConnection.invoke('SendMessage', senderId, receiverId, message)
        .catch(err => console.error(err));
    }

    getChatHistory(senderId: string, receiverId: string){
        this.hubConnection.invoke('GetChatHistory', senderId, receiverId)
        .then((ch) => {
            this.chatHistoryReceived.next(ch);
        })
        .catch(err => {
            console.error('error getting chat history:', err)
        });
    }

    onChatHistoryReceived(){
        return this.chatHistoryReceived.asObservable();
    }

    createGroup(groupName: string, userIds: string[]){
        this.hubConnection.invoke('CreateGroup', groupName, userIds)
        .catch(err => console.error(err));
    }

    addUsersToGroup(groupId: string, userIds: string[]){
        this.hubConnection.invoke('AddUsersToGroup', groupId, userIds)
        .catch(err => console.error(err));
    }

    getGroupChatHistory(groupId: string){
        this.hubConnection.invoke('GetGroupChatHistory', groupId)
        .then((ch) => {
            this.chatHistoryReceived.next(ch);
        })
        .catch(err => {
            console.error('error getting group chat history:', err)
        });
    }

    addUsers(username: string){
        this.hubConnection.invoke('CreateUser', username)
        .catch(err => console.error(err));
    }

    searchUsers(query: string){
        return this.hubConnection.invoke('SearchUsers', query);
    }

    searchGroups(query: string){
        return this.hubConnection.invoke('SearchGroups', query);
    }

}