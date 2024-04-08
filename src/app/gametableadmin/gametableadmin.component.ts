import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';
import { GamesService } from '../shared/games.service';

@Component({
  selector: 'app-gametableadmin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './gametableadmin.component.html',
  styleUrl: './gametableadmin.component.css'
})
export class GametableadminComponent {

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private gamesService: GamesService) { }


  gameCode: string | null | undefined;
  role: string | null | undefined;
  userId: string | null | undefined;

  username: string | null | undefined;
  scores: any[] = [];
  score: string = '';

  tasks: any[] = [];
  task: string = '';

  myCards: any;
  selectedCard: any; // Keep track of the selected card

  setOfCards: any[] = [];

  // Cardvalues for testgame
  myCard: number = 0;
  cardBot1: number = 0;
  cardBot2: number = 0;
  objectBot1: any;
  objectBot2: any;

  setOfCardName: string = "";
  setOfCardID: number = 0;

  regularCards = [
    {
      id: 1,
      value: 1,
      state: false
    },
    {
      id: 2,
      value: 2,
      state: false
    },
    {
      id: 3,
      value: 3,
      selected: false
    },
    {
      id: 4,
      value: 4,
      selected: false
    },
    {
      id: 5,
      value: 5,
      selected: false
    },
    {
      id: 6,
      value: 6,
      selected: false
    },
    {
      id: 7,
      value: 7,
      selected: false
    },
    {
      id: 8,
      value: 8,
      selected: false
    },
    {
      id: 9,
      value: 9,
      selected: false
    },
    {
      id: 10,
      value: 10,
      selected: false
    },
    {
      id: 11,
      value: 11,
      selected: false
    },
    {
      id: 12,
      value: 12,
      selected: false
    }
  ]

  fibonacciCards = [
    {
      id: 1,
      value: 1,
      state: false
    },
    {
      id: 2,
      value: 2,
      state: false
    },
    {
      id: 3,
      value: 3,
      state: false
    },
    {
      id: 4,
      value: 5,
      state: false
    },
    {
      id: 5,
      value: 8,
      state: false
    },
    {
      id: 6,
      value: 13,
      state: false
    },
    {
      id: 7,
      value: 21,
      state: false
    },
    {
      id: 8,
      value: 34,
      state: false
    },
    {
      id: 9,
      value: 55,
      state: false
    },
    {
      id: 10,
      value: 89,
      state: false
    },
    {
      id: 11,
      value: 144,
      state: false
    },
    {
      id: 12,
      value: 233,
      state: false
    }
  ]

  examples: Array<any> = [
    { userId: '1', score: null },
    { userId: '2', score: null },
    { userId: '3', score: null },
    { userId: '4', score: null },
    { userId: '5', score: null },
    { userId: '6', score: null },
    { userId: '7', score: null },
    { userId: '8', score: null }
  ];

  trackById(item: any): number {
    return item.id;
  }

  async ngOnInit() {
    this.gameCode = localStorage.getItem('gamecode');
    this.role = localStorage.getItem('role');
    this.username = localStorage.getItem('username');
    this.userId = localStorage.getItem('userId');

    // Retrieving details from our freshly created game by gamecode
    const gameByGameCode = await this.gamesService.getGameByGamecode(this.gameCode);
    // Fill in variable values
    this.setOfCardName = gameByGameCode.setofcardname;
    this.setOfCardID = gameByGameCode.setofcard_id;

    // Changing values in setOfCards depending on setOfCardID
    if (this.setOfCardID == 1) {
      this.setOfCards = this.regularCards;
    } else if (this.setOfCardID == 2) {
      this.setOfCards = this.fibonacciCards;
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

    channel.bind('task', (data: any) => {
      this.tasks.push(data);
    });

    for (let card of this.regularCards && this.fibonacciCards) {
      card.state = false;
    }
  }

  // Changes the selected card state to true, changes all other cards state to false and stores value in myCard
  onCardClick(card: any): void {
    this.setOfCards.forEach((c: any) => {
      c.state = false;
    });
    card.state = true;
    this.myCard = card.value;
    console.log("My card:", this.myCard);
  }

  toLobby() {
    const confirmed = window.confirm('Leaving this game as an admin could lead to malfunctions. Are you sure?');
    if (confirmed) {
      localStorage.removeItem('role');
      localStorage.removeItem('gamecode');
      this.toastr.success('Welcome back to the lobby', 'Succes');
      this.router.navigate(['/gamelobby']);
    } else {
      return;
    }
  }

  sendScore(): void {
    this.http.post('http://localhost:8000/api/scores', {
      userid: this.userId,
      username: this.username,
      score: this.myCard,
      room: this.gameCode
    }).subscribe(() => this.score = '');
  }

  sendTask(): void {
    this.http.post('http://localhost:8000/api/tasks', {
      task: this.task,
      room: this.gameCode
    }).subscribe(() => this.task = '');
  }


}
