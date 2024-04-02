import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gametableplayer',
  standalone: true,
  imports: [],
  templateUrl: './gametableplayer.component.html',
  styleUrl: './gametableplayer.component.css'
})
export class GametableplayerComponent {

  constructor(private toastr: ToastrService, private router: Router) { }

  gameChannel: string | null | undefined;
  role: string | null | undefined;

  ngOnInit() {
    this.gameChannel = localStorage.getItem('channel');
    this.role = localStorage.getItem('role');
  }

  toLobby() {
    const confirmed = window.confirm('Are you sure you want to leave this game?');
    if (confirmed) {
      localStorage.removeItem('role');
      localStorage.removeItem('channel');
      this.toastr.success('Welcome back to the lobby', 'Succes');
      this.router.navigate(['/gamelobby']);
    } else {
      return;
    }
  }

}
