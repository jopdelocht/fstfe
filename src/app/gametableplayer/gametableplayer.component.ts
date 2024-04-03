import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gametableplayer',
  standalone: true,
  imports: [],
  templateUrl: './gametableplayer.component.html',
  styleUrl: './gametableplayer.component.css'
})
export class GametableplayerComponent {

  constructor(private toastr: ToastrService, private router: Router) { }

  gameCode: string | null | undefined;
  role: string | null | undefined;

  ngOnInit() {
    this.gameCode = localStorage.getItem('gamecode');
    this.role = localStorage.getItem('role');
  }

  toLobby() {
    const confirmed = window.confirm('Are you sure you want to leave this game?');
    if (confirmed) {
      localStorage.removeItem('role');
      localStorage.removeItem('gamecode');
      this.toastr.success('Welcome back to the lobby', 'Succes');
      this.router.navigate(['/gamelobby']);
    } else {
      return;
    }
  }

  // gamesURL = this.gamesService.gamesURL;
  // gamesArray: any[] = [];



  // // Logic to display username in the header
  // username: string | null | undefined;
  // isLoggedIn: boolean = false;
  // ngOnInit() {
  //   if (localStorage.getItem('username')) {
  //     this.username = localStorage.getItem('username');
  //   }
  //   if (localStorage.getItem('token')) {
  //     this.isLoggedIn = true
  //   }
  //   this.initializeGames();
  // }

  // // bedoeling om te checken of gameCode bestaat --> joinGame
  // async fetchGames() {
  //   this.gamesArray = await this.gamesService.getGames();
  // }

  // // bedoeling om te checken of gameCode bestaat --> joinGame
  // async initializeGames() {
  //   await this.fetchGames();
  //   const matchingGameCode = this.gamesArray.find(game => game.gamecode === '152456');
  //   console.log(matchingGameCode);
  // }

}
