import { DisconnectComponent } from './disconnect/disconnect.component';
import { LoginComponent } from './login/login.component';
import { ConnexionService } from './connexion.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public loaded: boolean;
  public username: String;

  constructor(public cs: ConnexionService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) {
              this.loaded = false;
  }

  openSnackBar() {
    this.snackBar.openFromComponent(DisconnectComponent, {
      duration: 3000,
    });
  }

  ngOnInit() {
    this.openDialog();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.cs.send('SORT/' + this.username);
    console.log(`${this.username} is disconnected`);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('Result : ' + result);
      if (result !== undefined) {
        this.username = result;
        this.loaded = (result.length >= 4);
        // Si le username est bien defini, on envoi le message CONNEXION/username/ au middleware
        this.cs.send('CONNEXION/' + this.username );
      } else {
        this.openDialog();
      }
    });
  }

  disconnected(dc: boolean) {
    if (dc) {
      this.loaded = false;
      this.username = undefined;
      this.openSnackBar();
      this.openDialog();
    }
  }

}
