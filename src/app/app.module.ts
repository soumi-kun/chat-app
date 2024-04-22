import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebSocketService } from './shared/services/web-socket.service';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot({
      enableHtml: true,
      timeOut: 70000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    })
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
