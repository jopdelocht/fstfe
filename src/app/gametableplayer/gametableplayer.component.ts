import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-gametableplayer',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './gametableplayer.component.html',
  styleUrl: './gametableplayer.component.css'
})
export class GametableplayerComponent {

  constructor(private toastr: ToastrService, private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  gameCode: string | null | undefined;
  role: string | null | undefined;

  username: string | null | undefined;
  scores: any[] = [];
  score: string = '';

  ngOnInit() {
    this.gameCode = localStorage.getItem('gamecode');
    this.role = localStorage.getItem('role');

    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher('640e9781247d1e8565c9', {
      cluster: 'eu'
    });

    let channel = pusher.subscribe(this.gameCode!);
    channel.bind('score', (data: any) => {
      this.scores.push(data);
      console.log(this.scores);
    });
  }

  sendScore(): void {
    this.http.post('http://localhost:8000/api/scores', {
      username: this.username,
      score: this.score,
      room: this.gameCode
    }).subscribe(() => this.score = '');
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
