import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';


import { AppComponent } from './app.component';
import { ConnexionService } from './connexion.service';
import { LoginComponent } from './login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { DisconnectComponent } from './disconnect/disconnect.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MinutesecondsPipe } from './minuteseconds.pipe';
import { SelectedWordPipe } from './selected-word.pipe';
import { SessionInformationComponent } from './session-information/session-information.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    GameComponent,
    ChatComponent,
    DisconnectComponent,
    MinutesecondsPipe,
    SelectedWordPipe,
    SessionInformationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule
  ],
  entryComponents: [
    LoginComponent,
    DisconnectComponent
  ],
  providers: [ConnexionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
