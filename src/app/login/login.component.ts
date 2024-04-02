import { Component } from '@angular/core';
// Modules
import { FormsModule } from '@angular/forms';
// Services
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// Routing


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username!: string;
  password!: string;
  // email!:     string;
  showPassword: boolean = false;
  constructor(private userService: UserService, private toastr: ToastrService) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (!this.username || !this.password) {
      this.toastr.error('Please fill in all fields', 'Error');
    } else if (this.username && this.password) {
      const token = await this.userService.login(this.username, this.password);
      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('username', this.username);
        this.toastr.success('Logged in', 'Succes');
        setTimeout((this.redirectToHome), 2000);
      } else {
        this.toastr.error('Incorrect login credentials', 'Error');
      }
      this.username = '';
      this.password = '';
      // this.email ='';
    }
  }
  redirectToHome() {
    location.replace('http://localhost:4200/home');
  }

}
