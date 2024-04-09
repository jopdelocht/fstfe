import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from './shared/user.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn: any;
  username: string | null | undefined;
  userId: any;
  user: any;
  constructor(private toastr: ToastrService, private router: Router, private userService: UserService) {
  }

  redirectToHome() {
    location.replace('http://localhost:4200/home');
  }
  // Logout: delete token, username and userId
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.toastr.success('Logged out', 'Success');
    setTimeout((this.redirectToHome), 2000);
  }
  async ngOnInit() {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
      this.userId = parseInt(localStorage.getItem('userId') ?? '0', 10);;
      this.user = await this.userService.getUserById(this.userId);
      console.log(this.user);
    }
  }

  async navigateToGame() {
    await Promise.all([
      this.user = await this.userService.getUserById(this.userId)
    ]);
    if (this.isLoggedIn == true) {
      const role = this.user.role;
      if (!role) {
        this.router.navigate(['/gamelobby']);
      } else if (role) {
        this.router.navigate(['/gametable']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

}
