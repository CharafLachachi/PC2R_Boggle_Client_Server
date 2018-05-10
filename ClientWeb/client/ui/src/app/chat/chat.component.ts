import { ConnexionService } from './../connexion.service';
import { Component, OnInit, Input } from '@angular/core';

interface User {
  username: string;
}

interface ChatRoom {
  name: string;
  messages: Message[];
  unreadCounter: number;
  selected: boolean;
}

interface Message {
  username: string;
  content: string;
  send_date: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() selfUsername: string;

  public connectedUsers: User[];
  public chatRooms: ChatRoom[];
  private generalChatRoom: ChatRoom;
  public userMessage: string;

  constructor(public cs: ConnexionService) {
    this.userMessage = '';
    this.generalChatRoom = {
      name: 'General',
      messages: new Array<Message>(),
      unreadCounter : 0,
      selected: true
    };
    this.chatRooms = new Array<ChatRoom>();
    this.chatRooms.push(this.generalChatRoom);
    this.connectedUsers = new Array<User>();
    cs.onMessage().subscribe((message: String) => {
      const mt = message.split('/');
      let mot: string;
      switch (mt[0].toLowerCase().trim()) {
        case 'bienvenue':
          mot = mt[1];
          const user = {username: mot};
          this.addPlayerToUserListIfNotExists([user]);
          break;
        case 'gamestack':
          const messages: Message[] = JSON.parse(mt[6]);
          const players: User[] = JSON.parse(mt[8]);
          this.addPlayerToUserListIfNotExists(players);
          this.addMessagesToGeneralChannelIfNotExists(messages);
          break;
        case 'reception':
          const m: Message = JSON.parse(mt[1]);
          const gc = this.chatRooms.filter((cr) => cr.name.toLowerCase() === 'general')[0];
          if (gc.selected === false) {
            gc.unreadCounter++;
          }
          gc.messages.push(m);
          break;
        case 'preception':
          console.log('PRIVATE MESSAGE RECIEVED');
          const mm: Message = JSON.parse(mt[3]);
          const user1 = JSON.parse(mt[1]);
          const user2 = JSON.parse(mt[2]);
          if (user1 === this.selfUsername || user2 === this.selfUsername) {
            console.log('Ce message est à moi');
            let otherU: string;
            if (user1 === this.selfUsername) {
              otherU = user2;
            } else {
              otherU = user1;
            }
            const cr = this.chatRooms.filter((c) => c.name === otherU);
            if (cr.length === 0) {
              this.chatRooms.push({
                name: otherU,
                messages: [mm],
                unreadCounter: 1,
                selected: false
              });
            } else {
              cr[0].messages.push(mm);
              if (cr[0].selected === false) {
                cr[0].unreadCounter++;
              }
            }
          }
          break;
        case 'deconnexion':
          const uname = mt[1];
          const generalChatRoomMessages = this.chatRooms.filter((cr) => cr.name.toLowerCase().trim() === 'general')[0].messages;
          const messagesToDelete = generalChatRoomMessages.filter((mmm) => mmm.username === uname);
          const chatRoomToDelete = this.chatRooms.filter((cr) => cr.name.toLowerCase() === uname)[0];
          const userToDelete = this.connectedUsers.filter((u) => u.username.toLowerCase() === uname)[0];
          for (const mtd of messagesToDelete) {
            const idx = generalChatRoomMessages.indexOf(mtd);
            generalChatRoomMessages.splice(idx, 1);
          }
          if (chatRoomToDelete.selected) {
            this.chatRooms.filter((cr) => cr.name.toLowerCase().trim() === 'general')[0].selected = true;
          }
          this.chatRooms.splice(this.chatRooms.indexOf(chatRoomToDelete), 1);
          this.connectedUsers.splice(this.connectedUsers.indexOf(userToDelete), 1);
          break;
        default:
          break;
      }
    });
  }

  isBadgeHidden(cr: ChatRoom) {
    return cr.selected || (cr.unreadCounter <= 0);
  }

  selectChatRoom(cr: ChatRoom) {
    this.chatRooms.map((c) => c.selected = false);
    this.chatRooms[this.chatRooms.indexOf(cr)].selected = true;
    this.chatRooms[this.chatRooms.indexOf(cr)].unreadCounter = 0;
  }

  getSelectedRoomMessages(): Message[] {
    return this.chatRooms.filter((cr) => cr.selected === true)[0].messages;
  }

  getMessageClass(m: Message) {
    return (m.username.toLowerCase().trim() === this.selfUsername.toLowerCase().trim())? 'my-message-line':'others-message-line';
  }

  getChatRoomClass(cr: ChatRoom) {
    let res = 'user-pp';
    if (cr.selected === true) {
      res += ' selected';
    }
    return res;
  }

  createChatRoom(user: User) {
    const cr = {
      name: user.username,
      messages: new Array<Message>(),
      unreadCounter: 0,
      selected: false
    };
    this.chatRooms.push(cr);
    this.selectChatRoom(cr);
  }

  sendMessage() {
     console.log('Sending message');
     const scr = this.chatRooms.filter((cr) => cr.selected === true)[0];
     if (scr.name.toLowerCase() === 'general') {
       console.log('GENERAL CHAT MESSAGE SEND');
       this.cs.send(`ENVOI/${this.selfUsername}/${this.userMessage}`);
       this.userMessage = '';
     } else {
       this.cs.send(`PENVOI/${scr.name.toLowerCase()}/${this.selfUsername}/${this.userMessage}`);
       this.userMessage = '';
      }
   }

   getChatRoomName(): string {
     return (this.chatRooms.filter((cr) => cr.selected === true)[0].name.toLowerCase() === 'general') ?
     ' la chaine générale' :
     ' ' + this.chatRooms.filter((cr) => cr.selected === true)[0].name;
   }

  ngOnInit() {
  }

  private addPlayerToUserListIfNotExists(users: User[]) {
     if (this.connectedUsers.length === 0) {
       console.log('USERS EST VIDE');
       this.connectedUsers.push(...users);
     } else {
       console.log('SCORES EST PAS VIDE');
       for (const ss of users) {
         let e = false;
         for (const s of this.connectedUsers) {
           if (s.username.toLowerCase() === ss.username.toLowerCase()) {
             console.log('USER EXISTE DANS WORD LIST');
             e = true;
           }
         }
         if (e === false) {
           console.log('USER EXISTE PAS DANS WORD LIST');
           this.connectedUsers.push(ss);
         }
       }
     }
   }

     private addMessagesToGeneralChannelIfNotExists(messages: Message[]) {
       const gc = this.chatRooms.filter((cr) => cr.name.toLowerCase() === 'general')[0];
       if (gc.messages.length === 0) {
        console.log('MESSAGES EST VIDE');
        gc.messages.push(...messages);
       } else {
       console.log('MESSAGES EST PAS VIDE');
       for (const ss of messages) {
         let e = false;
         for (const s of gc.messages) {
           if ((s.username.toLowerCase() === ss.username.toLowerCase()) &&
               (s.content.toLowerCase() === ss.content.toLowerCase()) &&
               (s.send_date === ss.send_date)
              ) {
             console.log('MESSAGE EXISTE DANS MESSAGES LIST');
             e = true;
           }
         }
         if (e === false) {
           console.log('MESSAGE EXISTE PAS DANS MESSAGES LIST');
           gc.messages.push(ss);
         }
       }
     }
   }

   public connectedUsersExceptMe(): User[] {
   let si = -1;
   for (const i of this.connectedUsers) {
     if (i.username.toLowerCase().trim() === this.selfUsername.toLowerCase().trim()) {
       si = this.connectedUsers.indexOf(i);
       break;
     }
   }
    console.log('SELF INDEX ' + si);
     console.log(this.connectedUsers.slice(0, si).concat(this.connectedUsers.slice(si + 1)));
    return this.connectedUsers.slice(0, si).concat(this.connectedUsers.slice(si + 1));
   }
}
