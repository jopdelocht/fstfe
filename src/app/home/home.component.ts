import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router, private userService: UserService) { }

  isLoggedIn: boolean = false;
  username: string | null | undefined;
  userId: any;
  user: any;
  async ngOnInit() {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true
      this.userId = parseInt(localStorage.getItem('userId') ?? '0', 10);;
      this.user = await this.userService.getUserById(this.userId);
      this.username = this.user.username;
    }
  }


  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

}
