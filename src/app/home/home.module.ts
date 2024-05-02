import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { ChatHistoryDatePipe } from './chat-history-date.Pipe';


@NgModule({
  declarations: [HomeComponent,
    ChatHistoryDatePipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule
  ], 
  providers:[
    ChatHistoryDatePipe
  ]
})
export class HomeModule { }