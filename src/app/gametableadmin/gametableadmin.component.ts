import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gametableadmin',
  standalone: true,
  imports: [],
  templateUrl: './gametableadmin.component.html',
  styleUrl: './gametableadmin.component.css'
})
export class GametableadminComponent {

  constructor(private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  gameChannel: string | null | undefined;
  role: string | null | undefined;
  selectedSet: number = 0;
  gamename: string = "";

  ngOnInit() {
    this.gameChannel = localStorage.getItem('channel');
    this.role = localStorage.getItem('role');
    this.route.queryParams.subscribe(params => {
      this.selectedSet = Number(params['selectedSet']) || 0;
      this.gamename = params['gamename'] || '';
    });
    console.log('Het kanaal is:', this.gameChannel);
    console.log('Uw role is:', this.role);
    console.log('De gekozen gamenaam is:', this.gamename);
    console.log('De geselecteerde kaartenset is:', this.selectedSet, typeof this.selectedSet);
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
