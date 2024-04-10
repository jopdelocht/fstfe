import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from './shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { GamesService } from './shared/games.service';

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
  constructor(private toastr: ToastrService, private router: Router, private userService: UserService, private gamesService: GamesService) {
  }

  async ngOnInit() {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
      this.userId = parseInt(localStorage.getItem('userId') ?? '0', 10);;
      this.user = await this.userService.getUserById(this.userId);
      this.username = this.user.username;
    } else {
      return
    }
  }

  redirectToHome() {
    location.replace('http://localhost:4200/home');
  }

  async logout() {
    localStorage.removeItem('token');
    this.toastr.success('Logged out', 'Success');
    setTimeout((this.redirectToHome), 2000);
    await this.userService.removeUserRoleAndGameCode(this.userId);
  }

  async navigateToGame() {
    if (this.isLoggedIn == true) {
      await Promise.all([
        this.user = await this.userService.getUserById(this.userId)
      ]);
      const gamecode = this.user.gamecode;
      console.log('The users gamecode is: ' + gamecode);
      if (!gamecode) {
        this.router.navigate(['/gamelobby']);
      } else if (gamecode) {
        // when a user has a gamecode, patch the gamecode to NULL and navigate to gamelobby - Pusher
        this.gamesService.leaveGame(this.userId, gamecode);
        // also remove gamecode and role from database
        this.userService.removeUserRoleAndGameCode(this.userId);
        this.router.navigate(['/gamelobby']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

}
