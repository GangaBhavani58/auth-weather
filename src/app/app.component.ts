import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
    });

    this.isLoggedIn = this.userService.isLoggedIn();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
