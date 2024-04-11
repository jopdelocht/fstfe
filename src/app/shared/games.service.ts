import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient) { }

  gamesURL: string = 'http://localhost:8000/api/games/';

  // get games
  async getGames() {
    const response = await fetch(this.gamesURL);
    const games = await response.json();
    //console.log(games);
    return games;
  }

  //get game by gamecode
  async getGameByGamecode(gamecode: any) {
    const result = await fetch(this.gamesURL + gamecode);
    const gameByGameCode = await result.json();
    //console.log(gameByGameCode);
    return gameByGameCode;
  }



  async createGame(gameName: string, selectedSet: number, gameCode: string) {
    const token = localStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/2023.5.8',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        name: gameName,
        setofcard_id: selectedSet,
        gamecode: gameCode
      })
    };
    try {
      // before proceeding
      const response = await fetch(this.gamesURL, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      //console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}
