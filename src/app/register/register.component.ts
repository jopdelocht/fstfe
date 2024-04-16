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
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive, MatFormFieldModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  password!: string;
  username!: string;
  showPassword: boolean = false;
  email!: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private userService: UserService, private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.userService.getUsers()
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // check if all fields are filled
    if (!this.username || !this.password || !this.email) {
      this._snackBar.open('Please fill in all fields', 'Error', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    } else {
      // check if email is valid (containing @ and .)
      if (this.email.includes("@") === false || this.email.includes(".") === false) {
        this._snackBar.open('Please enter a valid email address', 'Error', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
      } else {
        // call method to register from userservice
        this.userService.register(this.username, this.password, this.email);

        // clear the fields;
        this.username = '';
        this.password = '';
        this.email = '';
      }
    }
  }
}