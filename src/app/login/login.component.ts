import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive, MatFormFieldModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username!: string;
  password!: string;
  showPassword: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private userService: UserService, private _snackBar: MatSnackBar) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (!this.username || !this.password) {
      this._snackBar.open('Please fill in all fields', 'Error', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    } else if (this.username && this.password) {
      const token = await this.userService.login(this.username, this.password);
      if (token) {
        localStorage.setItem('token', token)
        this._snackBar.open('Logged in', 'Success', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
        setTimeout((this.redirectToHome), 2000);
      } else {
        this._snackBar.open('Incorrect login credentials', 'Error', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
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
