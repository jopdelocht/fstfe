import { Component, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';
import { GamesService } from '../shared/games.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-gametable',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gametable.component.html',
  styleUrls: ['./gametable.component.css']
})
export class GametableComponent {

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private gamesService: GamesService,
    private userService: UserService) { }

  user: any;
  joinedPlayersArray: any[] = [];

  gameCode: any;
  role: string | null | undefined;
  userId: any;

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

  // FIXED ARRAY OF CARDS //
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


  // LOGIC ON INITIALIZATION //
  async ngOnInit() {
    // GET & SET DATA //
    // Retrieving userId from local storage, use it to fetch user
    this.userId = parseInt(localStorage.getItem('userId') ?? '0', 10);;
    this.user = await this.userService.getUserById(this.userId);

    // Fill in variable values
    this.gameCode = this.user.gamecode;
    this.role = this.user.role;
    this.username = this.user.username;

    this.joinedPlayersArray = await this.userService.getUsersByGameCode(this.gameCode);

    // Retrieving SoC-name and SoC-id from freshly created game, by gamecode (id)
    const gameByGameCode = await this.gamesService.getGameByGamecode(this.gameCode);
    // Fill in variable values
    this.setOfCardName = gameByGameCode.setofcardname;
    this.setOfCardID = gameByGameCode.setofcard_id;

    // Changing values in setOfCards depending on SoC-id
    if (this.setOfCardID == 1) {
      this.setOfCards = this.regularCards;
    } else if (this.setOfCardID == 2) {
      this.setOfCards = this.fibonacciCards;
    }


    // PUSHER BROADCASTING //
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

    channel.bind('joinedgame', (data: any) => {
      this.joinedPlayersArray.push(data);
      console.log('Hieronder een array van alle spelers die momenteel in het spel zitten:')
      console.log(this.joinedPlayersArray);
    });

    channel.bind('leftgame', (data: any) => {
      console.log(data);
      // Find and remove the user from the array of joined players
      const index = this.joinedPlayersArray.findIndex((player: any) => player.userid === data.userid);
      if (index !== -1) {
        this.joinedPlayersArray.splice(index, 1);
      }
      console.log('Hieronder een array van alle spelers die momenteel in het spel zitten:')
      console.log(this.joinedPlayersArray);
    });

    for (let card of this.regularCards && this.fibonacciCards) {
      card.state = false;
    }
  }


  // GAMETABLE FUNCTIONALITY //

  // Changes the selected card state to true, changes all other cards state to false and stores value in myCard
  onCardClick(card: any): void {
    this.setOfCards.forEach((c: any) => {
      c.state = false;
    });
    card.state = true;
    this.myCard = card.value;
    //console.log("My card:", this.myCard);
  }

  toLobby() {
    this.router.navigate(['/gamelobby']);
  }

  sendScore(): void {
    this.http.post('http://localhost:8000/api/scores', {
      userid: this.userId,
      username: this.username,
      score: this.myCard,
      room: this.gameCode
    }).subscribe();
  }

  sendTask(): void {
    this.http.post('http://localhost:8000/api/tasks', {
      task: this.task,
      room: this.gameCode
    }).subscribe(() => this.task = '');
  }

  trackById(item: any): number {
    return item.id;
  }


}
