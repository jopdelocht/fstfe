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

  gameCode: string | null | undefined;
  role: string | null | undefined;
  selectedSet: number = 0;
  gameName: string = "";

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

}
