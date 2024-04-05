import { Component } from '@angular/core';
import { CardService } from '../shared/card.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GamesService } from '../shared/games.service';

@Component({
  selector: 'app-gamelobby',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gamelobby.component.html',
  styleUrl: './gamelobby.component.css'
})
export class GamelobbyComponent {

  constructor(public cardService: CardService, private router: Router, private toastr: ToastrService, private gamesService: GamesService) { }

  gamesURL = this.gamesService.gamesURL;
  gamesArray: any[] = [];

  // Logic to display username in the header
  username: string | null | undefined;
  isLoggedIn: boolean = false;
  ngOnInit() {
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true
    }
    this.fetchGames();
  }

  // fetching data from games table, needed for duplicate gameCode check
  async fetchGames() {
    this.gamesArray = await this.gamesService.getGames();
  }

  // storing sessionname and gameCode in variable
  gameName: string = "";
  gameCode: string = "";

  // gamecode CAPS conversion variable
  gameCodeCAPS: string = "";

  // when the user selects a cardset from the dropdown menu (myCardSet), store the value in selectedSet
  myCardSet: any = "default";
  selectedSet: number = 0;

  updateSelectedCards(myCardSet: any) {
    if (myCardSet === "1") {
      this.selectedSet = 1;
    } else if (myCardSet === "2") {
      this.selectedSet = 2;
    }
  }

  async createGame() {
    if (!this.gameName || this.myCardSet === "default") {
      this.toastr.error('Please fill in all fields', 'Error');
      return;
    } else if (this.gameName && this.myCardSet) {
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

      let gameCode: string;
      let isDuplicate: boolean;

      // Generate random string and converts it to uppercase
      // Repeatedly generating new codes until it finds one that does not already exist in the gamesArray. 
      // Once a unique gameCode is found, the loop exits.
      do {
        gameCode = generateRandomString(6).toUpperCase();
        isDuplicate = this.gamesArray.some(game => game.gamecode === gameCode);
      } while (isDuplicate);

      localStorage.setItem('role', 'admin');
      localStorage.setItem('gamecode', gameCode);
      await Promise.all([
        this.gamesService.createGame(this.gameName, this.selectedSet, gameCode)]);

      this.toastr.success('Game created successfully', "Success");

      // Navigating to gametableadmin
      this.router.navigate(['/gametableadmin']);
    }
  }


  async joinGame() {
    // First convert the gamecode to uppercase
    this.gameCodeCAPS = this.gameCode.toUpperCase();

    // throw error if not filled in completely
    if (!this.gameCodeCAPS) {
      this.toastr.error('Please fill in all fields', 'Error');
      return;
      // throw error if not filled in correctly, string must be 6 characters long
    } else if (this.gameCodeCAPS.length !== 6) {
      this.toastr.error('The number of characters must be 6', 'Error');
      return;

    }
    // first refresh the array before checking for a duplicate
    await this.fetchGames();
    // throw error after checking if gamecode is valid
    if (!this.gamesArray.some((game: { gamecode: string; }) => game.gamecode === this.gameCodeCAPS)) {
      this.toastr.error('Provided gamecode is not valid', 'Error');
      return;
    }
    // sets role and gamecode in localstorage, navigates to gametable player with, after checking if gamecode is valid
    else if (this.gamesArray.some((game: { gamecode: string; }) => game.gamecode === this.gameCodeCAPS)) {
      localStorage.setItem('role', 'player')
      localStorage.setItem('gamecode', this.gameCodeCAPS);
      this.toastr.success('Game joined successfully', "Success");
      this.router.navigate(['/gametableplayer']);
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
