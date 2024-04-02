import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gametableadmin',
  standalone: true,
  imports: [],
  templateUrl: './gametableadmin.component.html',
  styleUrl: './gametableadmin.component.css'
})
export class GametableadminComponent {

  constructor(private toastr: ToastrService, private router: Router) { }

  gameChannel: string | null | undefined;
  role: string | null | undefined;

  ngOnInit() {
    this.gameChannel = localStorage.getItem('channel');
    this.role = localStorage.getItem('role');
  }

  toLobby() {
    const confirmed = window.confirm('Leaving this game as an admin could lead to malfunctions. Are you sure?');
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
