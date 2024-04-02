import { Component } from '@angular/core';
import { CardService } from '../shared/card.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gamelobby',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gamelobby.component.html',
  styleUrl: './gamelobby.component.css'
})
export class GamelobbyComponent {

  constructor(public cardService: CardService, private router: Router) { }


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

  // storing sessionname in variable
  sessionname: string = "";


  // when the user selects a channel from the dropdown menu (myChannel), store the value in chosenChannel
  myChannel: any = "default"
  chosenChannel: string = '';

  updateChannel() {
    if (this.myChannel === "een") {
      this.chosenChannel = "een";
      console.log('In UpdateChannel is de channel:');
      console.log(this.chosenChannel);
    } else if (this.myChannel === "twee") {
      this.chosenChannel = "twee";
      console.log('In UpdateChannel is de channel:');
      console.log(this.chosenChannel);
    }
  }


  // when the user selects a channel from the dropdown menu (myChannel), store the value in chosenChannel
  myCardSet: any = "default";
  selectedSet: string = '';

  updateSelectedCards(myCardSet: any) {
    if (myCardSet === "regular") {
      this.selectedSet = "regular";
    } else if (myCardSet === "fibonacci") {
      this.selectedSet = "fibonacci";
    }
  }


  // after the user has chosen a channel, by clicking the button CREATE --> navigate to chatexample component
  // also passes the current value of chosenChannel
  navigateToChatexample() {
    this.router.navigate(['/chatexample'],
      { state: { chosenChannel: this.chosenChannel, selectedSet: this.selectedSet, sessionname: this.sessionname } });
    console.log('In navigateToChatexample is de channel:');
    console.log(this.chosenChannel);
  }

  navigateToGametable() {
    this.router.navigate(['/gametable'], { state: { chosenChannel: this.chosenChannel, selectedSet: this.selectedSet, sessionname: this.sessionname } });
  }



  //  STORED FOR FUTURE USE
  //  regularcardsURL = this.cardService.regularCardsURL;
  //  regularCards: any[] = [];

  //  async fetchRegularCards() {
  //    this.regularCards = await this.cardService.getRegularCards();
  //    console.log(this.regularCards)
  //  }
}
