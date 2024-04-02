import { Component } from '@angular/core';
import { CardService } from '../shared/card.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gamelobby',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gamelobby.component.html',
  styleUrl: './gamelobby.component.css'
})
export class GamelobbyComponent {

  constructor(public cardService: CardService, private router: Router, private toastr: ToastrService) { }


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
  }

  // storing sessionname and gamechannel in variable
  gamename: string = "";
  gameChannel: string = "";


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


  // when the user selects a channel from the dropdown menu (myChannel), store the value in chosenChannel
  myCardSet: any = "default";
  selectedSet: number = 0;

  updateSelectedCards(myCardSet: any) {
    if (myCardSet === "1") {
      this.selectedSet = 1;
    } else if (myCardSet === "2") {
      this.selectedSet = 2;
    }
  }


  // after the user has chosen a channel, by clicking the button CREATE --> navigate to chatexample component
  // also passes the current value of chosenChannel
  // navigateToChatexample() {
  //   this.router.navigate(['/chatexample'],
  //     { state: { chosenChannel: this.chosenChannel, selectedSet: this.selectedSet, sessionname: this.gamename } });
  //   console.log('In navigateToChatexample is de channel:');
  //   console.log(this.chosenChannel);
  // }

  createGame() {
    if (!this.gamename || this.myCardSet === "default") {
      this.toastr.error('Please fill in all fields', 'Error');
      return;
    } else if (this.gamename && this.myCardSet) {
      // Generate a random string of 6 numbers for game channel
      const gameChannel = Math.random().toString().slice(2, 8);

      localStorage.setItem('role', 'admin')
      localStorage.setItem('channel', gameChannel);
      this.toastr.success('Game created successfully', "Let's go!");
      this.router.navigate(['/gametableadmin'], { queryParams: { selectedSet: this.selectedSet, gamename: this.gamename } });
    }
  }

  joinGame() {
    if (!this.gameChannel) {
      this.toastr.error('Please fill in all fields', 'Error');
      return;
    } else if (this.gameChannel.length !== 6) {
      this.toastr.error('The number of characters must be 6.', 'Error');
      return;

    }

    else if (this.gameChannel) {
      localStorage.setItem('role', 'player')
      localStorage.setItem('channel', this.gameChannel);
      this.toastr.success('Game joined successfully', "Let's go!");
      this.router.navigate(['/gametableplayer'], { queryParams: { selectedSet: this.selectedSet } });
    }
  }


  // navigateToGametable() {
  //   this.router.navigate(['/gametable'], { state: { chosenChannel: this.chosenChannel, selectedSet: this.selectedSet, sessionname: this.gamename } });
  // }



  //  STORED FOR FUTURE USE
  //  regularcardsURL = this.cardService.regularCardsURL;
  //  regularCards: any[] = [];

  //  async fetchRegularCards() {
  //    this.regularCards = await this.cardService.getRegularCards();
  //    console.log(this.regularCards)
  //  }
}
