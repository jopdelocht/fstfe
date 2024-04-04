import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';


@Component({
  selector: 'app-gametableadmin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './gametableadmin.component.html',
  styleUrl: './gametableadmin.component.css'
})
export class GametableadminComponent {

  constructor(private toastr: ToastrService, private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  gameCode: string | null | undefined;
  role: string | null | undefined;
  selectedSet: number = 0;
  gameName: string = "";

  username: string | null | undefined;
  scores: any[] = [];
  score: string = '';


  ngOnInit() {
    this.gameCode = localStorage.getItem('gamecode');
    this.role = localStorage.getItem('role');
    this.route.queryParams.subscribe(params => {
      this.selectedSet = Number(params['selectedSet']) || 0;
      this.gameName = params['gamename'] || '';
    });
    console.log('Het kanaal is:', this.gameCode);
    console.log('Uw role is:', this.role);
    console.log('De gekozen gamenaam is:', this.gameName);
    console.log('De geselecteerde kaartenset is:', this.selectedSet, typeof this.selectedSet);

    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher('640e9781247d1e8565c9', {
      cluster: 'eu'
    });

    let channel = pusher.subscribe(this.gameCode!);
    channel.bind('score', (data: any) => {
      this.scores.push(data);
    });

  }

  toLobby() {
    const confirmed = window.confirm('Leaving this game as an admin could lead to malfunctions. Are you sure?');
    if (confirmed) {
      localStorage.removeItem('role');
      localStorage.removeItem('gamecode');
      this.toastr.success('Welcome back to the lobby', 'Succes');
      this.router.navigate(['/gamelobby']);
    } else {
      return;
    }
  }

  sendScore(): void {
    this.http.post('http://localhost:8000/api/scores', {
      username: this.username,
      score: this.score,
      room: this.gameCode
    }).subscribe(() => this.score = '');
  }

}
