import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mean-course';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getLocalStorage();
  }
}
