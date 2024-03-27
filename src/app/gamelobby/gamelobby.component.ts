import { Component } from '@angular/core';

@Component({
  selector: 'app-gamelobby',
  standalone: true,
  imports: [],
  templateUrl: './gamelobby.component.html',
  styleUrl: './gamelobby.component.css'
})
export class GamelobbyComponent {
  username: string | null | undefined;
  isLoggedIn: boolean = false;
  ngOnInit() {
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true
    }
  }
}
