import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private router: Router, private toastr: ToastrService, private http: HttpClient) { }

  // Put Users API Endpoint URL in constant
  userURL: string = 'http://localhost:8000/api/users';


  // User register method => Hashing on backend
  async register(username: any, password: any, email: any) {
    // call array of users from API
    let users = await this.getUsers();
    // check if user or email already exists and only run register if they don't
    if (!users.some((user: { name: any; }) => user.name === username) && !users.some((user: { email: any; }) => user.email === email)) {
      const user = {
        name: username,
        password: password,
        email: email
      };
      const result = await fetch(this.userURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      // confirm user created
      this.toastr.success('Registered successfully', 'Success', { positionClass: 'toast-top-right', progressBar: true, progressAnimation: 'decreasing', timeOut: 3000 });
      // call method to go to login
      this.goToLogin();
      return result.json();
    } else {
      // error if user or email already exists
      this.toastr.error('Username and/or email already exists', 'Error', { positionClass: 'toast-top-right', progressBar: true, progressAnimation: 'decreasing', timeOut: 3000 });
    }
  }

  // get users
  async getUsers() {
    const response = await fetch(this.userURL);
    const users = await response.json();
    // console.log(users)
    return users;
  }

  // get all users by gamecode
  async getUsersByGameCode(gamecode: number) {
    const response = await fetch('http://127.0.0.1:8000/api/users-by-gamecode/' + gamecode);
    const usersByGameCode = await response.json();
    return usersByGameCode;
  }

  async getUserById(id: number) {
    const response = await fetch(this.userURL + '/' + id);
    const user = await response.json();
    return user;
  }

  // Update player's role and gamecode -> used when player joins or creates game - GAMELOBBY
  async joinGameUpdateDatabase(userId: number, role: string, gameCode: string) {
    const token = localStorage.getItem('token');
    const item = {
      role: role,
      gamecode: gameCode
    }
    const result = await fetch('http://localhost:8000/api/joingameupdatedatabase/' + userId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/2023.5.8',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(item)
    })
    if (!result.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await result.json();
    return data;
  }

  joinGameUpdatePusher(userId: any, userName: any, gameCode: any, role: any) {
    this.http.patch('http://localhost:8000/api/joingameupdatepusher', {
      userid: userId,
      username: userName,
      gamecode: gameCode,
      role: role
    }).subscribe();
  }


  // Remove player's role and gamecode -> used when player leaves a game - GAMETABLE, LOGOUT
  async leaveGameUpdateDatabase(userId: number) {
    const token = localStorage.getItem('token');

    const result = await fetch('http://localhost:8000/api/leavegameupdatedatabase/' + userId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/2023.5.8',
        Authorization: 'Bearer ' + token
      }
    })

    if (!result.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await result.json();
    return data;
  }

  leaveGameUpdatePusher(userId: number, gameCode: any) {
    this.http.patch('http://localhost:8000/api/leavegameupdatepusher', {
      userid: userId,
      gamecode: gameCode
    }).subscribe();
  }

  // Update player's score inside the database
  async setScoreUpdateDatabase(userId: number, score: number) {
    const token = localStorage.getItem('token');
    const item = {
      score: score
    }
    const result = await fetch('http://localhost:8000/api/setscoreupdatedatabase/' + userId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/2023.5.8',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(item)
    })
    if (!result.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await result.json();
    return data;
  }

  setScoreUpdatePusher(userId: any, score: number, gameCode: any) {
    this.http.patch('http://localhost:8000/api/setscoreupdatepusher', {
      userid: userId,
      score: score,
      gamecode: gameCode
    }).subscribe();
  }

  async displayScoreUpdateDatabase(gameCode: string) {
    const token = localStorage.getItem('token');
    const result = await fetch('http://localhost:8000/api/displayscoreupdatedatabase/' + gameCode, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/2023.5.8',
        Authorization: 'Bearer ' + token
      }
    })
    if (!result.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await result.json();
    return data;
  }

  displayScoreUpdatePusher(gameCode: string) {
    this.http.patch('http://localhost:8000/api/displayscoreupdatepusher', {
      gamecode: gameCode
    }).subscribe();
  }



  // Login method to return token
  async login(username: string, password: string) {
    let users = await this.getUsers();
    // check if user exists
    let user = users.find((u: { name: string; password: string }) => u.name === username);

    // check if password is correct
    if (user && bcrypt.compareSync(password, user.password)) {
      // Store the user ID in localStorage
      localStorage.setItem('userId', user.id);
      return user.remember_token.toString();
    }
    return null;
  }
  // go to login
  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
  // go to  home
  goToHome(): void {
    this.router.navigateByUrl('/home');
  }
}
