import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import * as generate from 'project-name-generator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: String;
  constructor(public dr: MatDialogRef<LoginComponent>) {
    this.username = '';
  }

  ngOnInit() {
  }

  public random() {
    this.username = generate().dashed;
    this.dr.close(this.username);
  }


}
