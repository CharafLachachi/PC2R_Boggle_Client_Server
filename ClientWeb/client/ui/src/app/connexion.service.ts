import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ConnexionService {

  private url = 'http://localhost:8746';

  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  public send(message: String): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<String> {
    return new Observable<String>(observer => {
      console.log('Message recieved in web socket');
      this.socket.on('message', (d) => {
        const dt = JSON.parse(d);
        console.log(`CONNEXION SERVICE ICI LE MESSAGE ${dt}`);
        observer.next(dt);
      });
    });
  }

}
