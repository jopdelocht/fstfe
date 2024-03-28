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



  regularcardsURL = this.cardService.regularCardsURL;
  regularCards: any[] = [];

  async fetchRegularCards() {
    this.regularCards = await this.cardService.getRegularCards();
    console.log(this.regularCards)
  }

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
    this.fetchRegularCards();
  }


  myChannel: any = "default"
  chosenChannel: string = '';

  updateChannel() {
    if (this.myChannel === "een") {
      this.chosenChannel = "een";
      console.log(this.chosenChannel);
    } else if (this.myChannel === "twee") {
      this.chosenChannel = "twee";
      console.log(this.chosenChannel);
    }
  }

  navigateToChatexample() {
    this.router.navigate(['/chatexample'], { state: { chosenChannel: this.chosenChannel } });
 }
}
