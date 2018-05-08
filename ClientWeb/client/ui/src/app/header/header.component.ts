import { MatSnackBar } from '@angular/material';
import { ConnexionService } from './../connexion.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() username: String;
  @Output() disconnected = new EventEmitter<boolean>();
  public remainingTime: number;
  public timer: number;
  private nTimer: NodeJS.Timer;

  constructor(public cs: ConnexionService, public snackBar: MatSnackBar) {
    this.timer = 100;
    this.cs.onMessage()
      .subscribe((message: String) => {
        const mws = message.split('\n');
        mws.map((m) => {
          const mt = m.trim().split('/');
          switch (mt[0].toLowerCase()) {
            case 'session':
              console.log('Début d\'une session');
              break;
            case 'tour':
              if (this.nTimer === undefined) {
                this.startTimer();
              }
              break;
            case 'rfin':
              this.stopTimer();
              break;
            case 'timer':
              console.log('TIMER VALUEEEEEEE : ' + mt[1]);
              if (this.remainingTime === undefined) {
                const timerValue = +mt[1];
                this.remainingTime = timerValue;
              }
              break;
            default:
              break;
          }
        });
      });
  }

  private startTimer(): void {
    this.nTimer = setInterval(() => {
      this.remainingTime--;
      this.timer -= (this.timer / this.remainingTime);
    }, 1000);

    this.openSnackBar(this.secondsToText());
  }

  private secondsToText(): string {
    const message = 'Vous avez';
    const min = Math.floor(this.remainingTime / 60);
    const sec = this.remainingTime % 60;
    return `${message}
             ${(min > 0) ? (min + ' ' + ((min > 1) ? 'minutes' : 'minute')) : ''}
             ${(min > 0) &&  (sec > 0) ? 'et ' : ''}
            ${(sec > 0) ? (sec + ' ' + ((sec > 1) ? 'secondes' : 'seconde')) : ''}
             🤔`;
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, undefined, { duration: 2000 });
  }

  private stopTimer() {
    this.openSnackBar('Time is up! 🤯');
    clearInterval(this.nTimer);
    this.nTimer = undefined;
    this.timer = 100;
    this.remainingTime = undefined;
  }

  ngOnInit() {
  }

  disconnect() {
    this.cs.send('SORT/' + this.username);
    console.log(`${this.username} is disconnected`);
    this.disconnected.emit(true);
  }


}
