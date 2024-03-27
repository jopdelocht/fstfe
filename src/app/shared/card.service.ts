import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor() { }

    // Put regular cards API Endpoint URL in constant
    regularCardsURL: string = 'http://localhost:8000/regularcards/';

    // get regular cards
    async getRegularCards() {
      return (await fetch(this.regularCardsURL)).json()
    }
}
