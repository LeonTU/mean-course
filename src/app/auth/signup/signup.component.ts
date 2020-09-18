import { AuthService } from './../auth.service';
import { User } from './../user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void { }

  onSignup(user: User) {
    this.authService.signup(user).subscribe((result: any) => {
      console.log(result.message);
      console.log(result.result);
    });
  }
}
