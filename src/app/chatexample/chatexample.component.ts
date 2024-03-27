import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Pusher from 'pusher-js';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatexample',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chatexample.component.html',
  styleUrl: './chatexample.component.css'
})

export class ChatexampleComponent {

  constructor(private http: HttpClient) {

  }

  username = 'username';
  messages: any[] = [];
  message = '';



  ngOnInit(): void {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher('640e9781247d1e8565c9', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', (data: any) => {
      this.messages.push(data);
    });
  }

  sendMessage(): void {
    this.http.post('http://localhost:8000/api/messages', {
      username: this.username,
      message: this.message
    }).subscribe(() => this.message = '');
  }
}
