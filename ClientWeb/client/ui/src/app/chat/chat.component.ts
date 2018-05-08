import { ConnexionService } from './../connexion.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(public cs: ConnexionService) {

   }

   sendMessage() {
     console.log('Sending message');
     this.cs.send('ENVOI/wesh l\'équipe');
   }

  ngOnInit() {
  }

}
