import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from './shared/user.service';
import { GamesService } from './shared/games.service';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatFormFieldModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn: any;
  username: string | null | undefined;
  userId: any;
  user: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private router: Router,
    private userService: UserService,
    private gamesService: GamesService,
    private _snackBar: MatSnackBar) {
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
    // Ensure the user's data is fully loaded
    await this.userService.getUserById(this.userId).then(user => {
      this.user = user;
    });

    // Now proceed with the logout process
    await Promise.all([
      this.userService.leaveGameUpdatePusher(this.userId, this.user.gamecode),
      this.userService.leaveGameUpdateDatabase(this.userId)
    ]);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('gameCode');
    this._snackBar.open('Logged out', 'Success', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
    setTimeout(this.redirectToHome, 1500);
  }

  async navigateToGame() {
    if (this.isLoggedIn == true) {
      await Promise.all([
        this.user = await this.userService.getUserById(this.userId)
      ]);
      const gamecode = this.user.gamecode;
      if (!gamecode) {
        this.router.navigate(['/gamelobby']);
      } else if (gamecode) {
        // when a user has a gamecode, patch the gamecode to NULL and navigate to gamelobby - Pusher
        // also remove gamecode and role from database
        this.userService.leaveGameUpdateDatabase(this.userId);
        this.userService.leaveGameUpdatePusher(this.userId, this.user.gamecode);
        this.router.navigate(['/gamelobby']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }




}
