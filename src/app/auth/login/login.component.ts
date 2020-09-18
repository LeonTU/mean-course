import { AuthService } from './../auth.service';
import { AuthData } from './../auth-data.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit(): void { }

  onLogin(authData: AuthData) {
    this.authService.login(authData);
  }
}
