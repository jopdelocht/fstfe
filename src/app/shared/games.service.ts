import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor() { }

  gamesURL: string = 'http://localhost:8000/api/games/';


  async createGame(gameName: string, selectedSet: number, gameChannel: string) {
    const token = localStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/2023.5.8', Authorization: 'Bearer ' + token },
      body: JSON.stringify({
        name: gameName,
        setofcard_id: selectedSet,
        channel: gameChannel
      })
    };

    fetch(this.gamesURL, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }
}
