import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Pusher from 'pusher-js';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatexample',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chatexample.component.html',
  styleUrl: './chatexample.component.css'
})

export class ChatexampleComponent {

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  username: string | null | undefined;
  messages: any[] = [];
  message = '';

  chosenChannel: string = '';


  // logChannel(channel: string) {
  //   console.log(channel)
  // }



  ngOnInit(): void {

    // getting chosen channel data from gamelobby component
    const state = history.state as { chosenChannel: string };
    if (state) {
      this.chosenChannel = state.chosenChannel;
    }
    console.log(this.chosenChannel);

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher('640e9781247d1e8565c9', {
      cluster: 'eu'
    });

    let channel = pusher.subscribe('chat' + this.chosenChannel);
    channel.bind('message', (data: any) => {
      this.messages.push(data);
      console.log(this.messages);

    });
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }

  }



  sendMessage(): void {
    this.http.post('http://localhost:8000/api/messages/', {
      username: this.username,
      message: this.message,

    }).subscribe(() => this.message = '');

  }
}
