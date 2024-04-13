import { Component } from '@angular/core';
import { CardService } from '../shared/card.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GamesService } from '../shared/games.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../shared/user.service';
@Component({
  selector: 'app-gamelobby',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gamelobby.component.html',
  styleUrl: './gamelobby.component.css'
})
export class GamelobbyComponent {

  constructor(
    private userService: UserService,
    public cardService: CardService,
    private router: Router,
    private toastr: ToastrService,
    private gamesService: GamesService,
    private http: HttpClient) { }

  gamesURL = this.gamesService.gamesURL;
  gamesArray: any[] = [];
  userId: any;
  user: any;
  userName: string = "";
  score: number | null = null;

  // LOGIC ON INITIALIZATION //
  async ngOnInit() {
    // GET & SET DATA //
    // Retrieving userId from local storage, use it to fetch user
    this.userId = parseInt(localStorage.getItem('userId') ?? '0', 10);;

    this.user = await this.userService.getUserById(this.userId);
    await this.fetchGames()

    this.userName = this.user.username;

  }

  //    CREATING A GAME     //

  // fetching all games from games table, needed for duplicate gameCode check when creating a new game
  async fetchGames() {
    this.gamesArray = await this.gamesService.getGames();
  }

  // storing gameName and gameCode in variable, needed for creating a new game
  gameNameOnCreate: string = "";
  gameCodeOnCreate: string = "";


  // when the user selects a cardset from the dropdown menu (myCardSet), store the value in selectedSet
  myCardSetOnCreate: any = "default";
  selectedSet: number = 0;

  updateSelectedCards(myCardSetOnCreate: any) {
    if (myCardSetOnCreate === "1") {
      this.selectedSet = 1;
    } else if (myCardSetOnCreate === "2") {
      this.selectedSet = 2;
    }
  }

  async createGame() {
    const role = 'admin';
    if (!this.gameNameOnCreate || this.myCardSetOnCreate === "default") {
      this.toastr.error('Please fill in all fields', 'Error');
      return;
    } else if (this.gameNameOnCreate && this.myCardSetOnCreate) {
      // First refresh the array before checking for a duplicate
      await this.fetchGames();

      // Function to generate a random alphanumeric string
      // Left out to avoid confusion: O, 0, 1, I, Q
      const generateRandomString = (length: number): string => {
        const chars = '23456789ABCDEFGHJKLMNPRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      let isDuplicate: boolean;

      // Generate random string and converts it to uppercase
      // Repeatedly generating new codes until it finds one that does not already exist in the gamesArray. 
      // Once a unique gameCode is found, the loop exits.
      do {
        this.gameCodeOnCreate = generateRandomString(6).toUpperCase();
        isDuplicate = this.gamesArray.some(game => game.gamecode === this.gameCodeOnCreate);
      } while (isDuplicate);

      await Promise.all([
        this.gamesService.createGame(this.gameNameOnCreate, this.selectedSet, this.gameCodeOnCreate),
        this.userService.joinGameUpdateDatabase(this.userId, role, this.gameCodeOnCreate),
      ]);
      this.userService.joinGameUpdatePusher(this.userId, this.userName, this.gameCodeOnCreate, role);

      localStorage.setItem('gameCode', this.gameCodeOnCreate);
      this.toastr.success('Game created successfully', "Success");
      this.router.navigate(['/gametable']);
    }
  }


  //    JOINING A GAME     //

  // storing gameCode in variable, needed for joining a game
  gameCodeOnJoin: string = "";
  // gamecode CAPS conversion variable
  gameCodeOnJoinToCAPS: string = "";

  async joinGameByGameCode() {
    const role = 'player';
    // First convert the gamecode to uppercase
    this.gameCodeOnJoinToCAPS = this.gameCodeOnJoin.toUpperCase();

    // throw error if not filled in completely
    if (!this.gameCodeOnJoinToCAPS) {
      this.toastr.error('Please fill in all fields', 'Error');
      return;
      // throw error if not filled in correctly, string must be 6 characters long
    } else if (this.gameCodeOnJoinToCAPS.length !== 6) {
      this.toastr.error('The number of characters must be 6', 'Error');
      return;
    }

    // first refresh the array before checking for a duplicate
    await this.fetchGames();
    // throw error after checking if gamecode is valid
    if (!this.gamesArray.some((game: { gamecode: string; }) => game.gamecode === this.gameCodeOnJoinToCAPS)) {
      this.toastr.error('Provided gamecode is not valid', 'Error');
      return;
    }

    // navigates to gametable after checking if gamecode is valid
    else if (this.gamesArray.some((game: { gamecode: string; }) => game.gamecode === this.gameCodeOnJoinToCAPS)) {

      await Promise.all([
        this.userService.joinGameUpdateDatabase(this.userId, role, this.gameCodeOnJoinToCAPS)
      ]);
      this.userService.joinGameUpdatePusher(this.userId, this.userName, this.gameCodeOnJoinToCAPS, role);


      localStorage.setItem('gameCode', this.gameCodeOnJoinToCAPS);
      this.toastr.success('Game joined successfully', "Success");
      this.router.navigate(['/gametable']);
    }
  }




  //  STORED FOR FUTURE USE
  //  regularcardsURL = this.cardService.regularCardsURL;
  //  regularCards: any[] = [];

  //  async fetchRegularCards() {
  //    this.regularCards = await this.cardService.getRegularCards();
  //    console.log(this.regularCards)
  //  }

  // when the user selects a channel from the dropdown menu (myChannel), store the value in chosenChannel
  // myChannel: any = "default"
  // chosenChannel: string = '';

  // updateChannel() {
  //   if (this.myChannel === "een") {
  //     this.chosenChannel = "een";
  //     console.log('In UpdateChannel is de channel:');
  //     console.log(this.chosenChannel);
  //   } else if (this.myChannel === "twee") {
  //     this.chosenChannel = "twee";
  //     console.log('In UpdateChannel is de channel:');
  //     console.log(this.chosenChannel);
  //   }
  // }

  // navigateToGametable() {
  //   this.router.navigate(['/gametable'], { state: { chosenChannel: this.chosenChannel, selectedSet: this.selectedSet, sessionname: this.gamename } });
  // }

  // after the user has chosen a channel, by clicking the button CREATE --> navigate to chatexample component
  // also passes the current value of chosenChannel
  // navigateToChatexample() {
  //   this.router.navigate(['/chatexample'],
  //     { state: { chosenChannel: this.chosenChannel, selectedSet: this.selectedSet, sessionname: this.gamename } });
  //   console.log('In navigateToChatexample is de channel:');
  //   console.log(this.chosenChannel);
  // }
}
