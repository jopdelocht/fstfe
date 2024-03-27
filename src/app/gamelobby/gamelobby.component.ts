import { Component } from '@angular/core';
import { CardService } from '../shared/card.service';

@Component({
  selector: 'app-gamelobby',
  standalone: true,
  imports: [],
  templateUrl: './gamelobby.component.html',
  styleUrl: './gamelobby.component.css'
})
export class GamelobbyComponent {

  constructor(public cardService: CardService) { }



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
}
