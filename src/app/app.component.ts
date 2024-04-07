import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

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
  constructor(private toastr: ToastrService, private router: Router) {
  }

  redirectToHome() {
    location.replace('http://localhost:4200/home');
  }
  // Logout: delete token
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.toastr.success('Logged out', 'Success');
    setTimeout((this.redirectToHome), 2000);
  }
  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }
  }

  navigateToGame() {
    const role = localStorage.getItem('role');
    if (!role) {
      this.router.navigate(['/gamelobby']);
    } else if (role === 'admin') {
      this.router.navigate(['/gametableadmin']);
    } else if (role === 'player') {
      this.router.navigate(['/gametableplayer']);
    }
  }
}
