import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';
import { GamesService } from '../shared/games.service';
import { UserService } from '../shared/user.service';
import { TasksService } from '../shared/tasks.service';

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
  selector: 'app-gametable',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './gametable.component.html',
  styleUrls: ['./gametable.component.css']
})
export class GametableComponent {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private gamesService: GamesService,
    private userService: UserService,
    private tasksService: TasksService,

    private _snackBar: MatSnackBar) { }

  user: any;
  joinedPlayersArray: any[] = [];

  gameCode: any;
  role: string | null | undefined;
  userId: any;

  username: string | null | undefined;
  scores: any[] = [];
  score: string = '';

  myCards: any;
  selectedCard: any; // Keep track of the selected card

  setOfCards: any[] = [];

  tasks: any[] = [];
  taskTitle: string = "";
  taskDescription: string = "";
  reversedTasks: any[] = [];



  // Cardvalues for testgame
  myCard: number | null | undefined;
  cardBot1: number = 0;
  cardBot2: number = 0;
  objectBot1: any;
  objectBot2: any;

  setOfCardName: string = "";
  setOfCardID: number = 0;
  gameName: string = "";

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
    this.tasks = await this.tasksService.getTasksByGameCode(this.gameCode);
    this.reversedTasks = [...this.tasks].reverse();


    // Retrieving SoC-name and SoC-id from freshly created game, by gamecode (id)
    const gameByGameCode = await this.gamesService.getGameByGamecode(this.gameCode);
    // Fill in variable values
    this.setOfCardName = gameByGameCode.setofcardname;
    this.setOfCardID = gameByGameCode.setofcard_id;
    this.gameName = gameByGameCode.gamename;

    // Changing values in setOfCards depending on SoC-id
    if (this.setOfCardID == 1) {
      this.setOfCards = this.regularCards;
    } else if (this.setOfCardID == 2) {
      this.setOfCards = this.fibonacciCards;
    }

    for (let card of this.regularCards && this.fibonacciCards) {
      card.state = false;
    }


    // PUSHER BROADCASTING //
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher('640e9781247d1e8565c9', {
      cluster: 'eu'
    });

    let channel = pusher.subscribe(this.gameCode!);

    channel.bind('joinedgame', (data: any) => {
      this.joinedPlayersArray.push(data);
      this._snackBar.open('Player has joined the game', 'Hi', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
      console.log('PUSHER - Dit is de joined players array wanneer iemand de game joined:')
      console.log(this.joinedPlayersArray);
    });

    channel.bind('leftgame', (data: any) => {
      // Find and remove the user from the array of joined players
      const index = this.joinedPlayersArray.findIndex((player: any) => player.userid === data.userid);
      if (index !== -1) {
        this.joinedPlayersArray.splice(index, 1);
        this._snackBar.open('Player has left the game', 'Bye', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
      }

      console.log('PUSHER - Dit is de joined players array wanneer iemand de game leaved:')
      console.log(this.joinedPlayersArray);
    });

    channel.bind('score', (data: any) => {
      // Find the player with the corresponding ID and update their score
      const playerIndex = this.joinedPlayersArray.findIndex((player: any) => player.userid === data.userid);
      if (playerIndex !== -1) {
        this.joinedPlayersArray[playerIndex].score = data.score; // Update the score
      }
      console.log('PUSHER - Dit is de joined players array wanneer iemand gevote heeft:')
      console.log(this.joinedPlayersArray);
    });

    channel.bind('displayscore', (data: any) => {
      this.joinedPlayersArray.forEach((player: any) => {
        // Check if the gamecode matches the gamecode from the Pusher data, and whether or not the player has voted
        if (player.gamecode === data.gamecode && player.score !== null) {
          // Update the displayscore to 1
          player.displayscore = 1;
        }
      });
      this.tasks.forEach((task: any) => {
        if (task.gamecode === data.gamecode) {
          task.displayscore = 1;
        }
      });
      console.log('PUSHER - Updated joined players array, na de displayscore:', this.joinedPlayersArray);
      console.log('PUSHER - Updated tasks array, na de displayscore:', this.tasks);
    });


    channel.bind('resetscore', (data: any) => {
      this.joinedPlayersArray.forEach((player: any) => {
        if (player.gamecode === data.gamecode) {
          player.displayscore = 0;
          player.score = null;
        }
      });
      this.tasks.forEach((task: any) => {
        if (task.gamecode === data.gamecode) {
          task.displayscore = 0;
        }
      })
      // Reset the state of the selected card
      this.setOfCards.forEach((card: any) => {
        if (card.state) {
          card.state = false;
        }
      });
      this.myCard = null;
      console.log('PUSHER - Updated joined players array, na de resetscore:', this.joinedPlayersArray);
      this._snackBar.open('Scores have been reset', 'Success', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });

    });


    channel.bind('createtask', (data: any) => {
      // pushes the task into the tasks array
      this.tasks.push(data);
      this.reversedTasks = [...this.tasks].reverse();
      // resets the scores of all players, by gamecode, to 0 or null
      this.joinedPlayersArray.forEach((player: any) => {
        if (player.gamecode === data.gamecode) {
          player.displayscore = 0;
          player.score = null;
        }
      });
      // resets all scores of all tasks, by gamecode, to 0
      this.reversedTasks.forEach((task: any) => {
        if (task.gamecode === data.gamecode) {
          task.displayscore = 0;
        }
      })
      // Reset the state of the selected card
      this.setOfCards.forEach((card: any) => {
        if (card.state) {
          card.state = false;
        }
      });
      this.myCard = null;
      this._snackBar.open('A new task has been created', 'Vote', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
      console.log('PUSHER - Updated tasks array, na de createtask:');
      console.log(this.tasks);
    });

    channel.bind('setscoretotask', (data: any) => {
      // Find the index of the task with matching taskid
      const index = this.tasks.findIndex(task => task.taskid === data.taskid);

      // If the task with matching taskid exists, update its properties
      if (index !== -1) {
        this.tasks[index].averagescore = data.averagescore;
        this.tasks[index].lowestscore = data.lowestscore;
        this.tasks[index].highestscore = data.highestscore;
      } else {
        return
      }

      console.log(this.tasks);
    });
  }


  // GAMETABLE FUNCTIONALITY //

  // Changes the selected card state to true, changes all other cards state to false and stores value in myCard
  onCardClick(card: any) {
    this.setOfCards.forEach((c: any) => {
      c.state = false;
    });
    card.state = true;
    this.myCard = card.value;
    return this.myCard;
  }

  toLobby() {
    this.router.navigate(['/gamelobby']);
  }

  submitScore() {
    if (!this.myCard) {
      this._snackBar.open('Please select a card', 'Error!', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
      return;
    } else if (this.myCard === null) {
      this._snackBar.open('Please select a card', 'Error!', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
      return;
    } else if (this.myCard !== null && this.myCard !== undefined) {
      this.userService.setScoreUpdateDatabase(this.userId, this.myCard);
      this.userService.setScoreUpdatePusher(this.userId, this.myCard, this.gameCode);
    }
  }

  trackById(item: any): number {
    return item.id;
  }

  deletePlayer(userid: number, gameCode: string) {
    this.userService.leaveGameUpdateDatabase(userid);
    this.userService.leaveGameUpdatePusher(userid, gameCode);
  }

  averageScore: number | null | undefined;
  lowestScore: number | null | undefined;
  highestScore: number | null | undefined;
  async revealCards() {
    // Patch displayscore from 0 to 1, therefore revealing cards
    this.userService.displayScoreUpdateDatabase(this.gameCode);
    this.userService.displayScoreUpdatePusher(this.gameCode);

    // Calculate average score, lowest score, and highest score
    this.averageScore = Math.round(
      this.joinedPlayersArray
        .map((player) => player.score)
        .reduce((total, score) => total + score, 0)
      / this.joinedPlayersArray.length
    );
    this.lowestScore = Math.min(...this.joinedPlayersArray.map((player) => player.score));
    this.highestScore = Math.max(...this.joinedPlayersArray.map((player) => player.score));

    // Find the task with the highest ID (therefore the most recent task)
    const mostRecentTask = await this.tasks.reduce((prev, current) => {
      return (prev.id > current.id) ? prev : current;
    });

    // Ensuring mostRecentTask is not undefined before proceeding
    if (mostRecentTask) {
      const taskId = mostRecentTask.taskid;
      await this.tasksService.setTaskScoreUpdateDatabase(taskId, this.averageScore, this.lowestScore, this.highestScore);
      this.tasksService.setTaskScoreUpdatePusher(taskId, this.averageScore, this.lowestScore, this.highestScore, this.gameCode);
    } else {
      console.log('No recent task found.');
    }
  }

  async createTask() {
    if (!this.taskTitle || !this.taskDescription) {
      this._snackBar.open('Please fill in all fields', 'Error', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    } else if (this.taskTitle && this.taskDescription) {
      const taskData = await this.tasksService.createTaskDB(this.taskTitle, this.taskDescription, this.gameCode);
      // Assuming createTaskDB now returns the task ID
      const taskId = taskData.taskId;
      this.tasksService.createTaskPusher(this.taskTitle, this.taskDescription, this.gameCode, taskId);
      // Clear the fields
      this.taskTitle = '';
      this.taskDescription = '';
    }
  }

  resetScore() {
    this.userService.resetScoreUpdateDatabase(this.gameCode);
    this.userService.resetScoreUpdatePusher(this.gameCode);
  }


}



