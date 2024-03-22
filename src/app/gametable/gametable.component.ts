import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-gametable',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gametable.component.html',
  styleUrl: './gametable.component.css'
})
export class GametableComponent {

  constructor(private toastr: ToastrService) { }

  myCards: any;

  regularCards = [
    {
      id: 1,
      value: 1
    },
    {
      id: 2,
      value: 2
    },
    {
      id: 3,
      value: 3
    },
    {
      id: 4,
      value: 4
    },
    {
      id: 5,
      value: 5
    },
    {
      id: 6,
      value: 6
    },
    {
      id: 7,
      value: 7
    },
    {
      id: 8,
      value: 8
    },
    {
      id: 9,
      value: 9
    },
    {
      id: 10,
      value: 10
    },
    {
      id: 11,
      value: 11
    },
    {
      id: 12,
      value: 12
    }
  ]

  fibonacciCards = [
    {
      id: 1,
      value: 1
    },
    {
      id: 2,
      value: 2
    },
    {
      id: 3,
      value: 3
    },
    {
      id: 4,
      value: 5
    },
    {
      id: 5,
      value: 8
    },
    {
      id: 6,
      value: 13
    },
    {
      id: 7,
      value: 21
    },
    {
      id: 8,
      value: 34
    },
    {
      id: 9,
      value: 55
    },
    {
      id: 10,
      value: 89
    },
    {
      id: 11,
      value: 144
    },
    {
      id: 12,
      value: 233
    }
  ]

  trackById(index: number, item: any): number {
    return item.id;
  }
}
