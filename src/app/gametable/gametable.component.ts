import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gametable',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gametable.component.html',
  styleUrls: ['./gametable.component.css']
})
export class GametableComponent {

  constructor(private toastr: ToastrService) { }

  myCards: any;
  selectedCard: any; // Keep track of the selected card
  chosenSet: any = "default";
  // Keeping track of the selected set of cards coming from the select dropdown
  selectedSet: any[] = [];

  regularCards = [
    {
      id: 1,
      value: 1,
      state: false
    },
    {
      id: 2,
      value: 2,
      state: false
    },
    {
      id: 3,
      value: 3,
      selected: false
    },
    {
      id: 4,
      value: 4,
      selected: false
    },
    {
      id: 5,
      value: 5,
      selected: false
    },
    {
      id: 6,
      value: 6,
      selected: false
    },
    {
      id: 7,
      value: 7,
      selected: false
    },
    {
      id: 8,
      value: 8,
      selected: false
    },
    {
      id: 9,
      value: 9,
      selected: false
    },
    {
      id: 10,
      value: 10,
      selected: false
    },
    {
      id: 11,
      value: 11,
      selected: false
    },
    {
      id: 12,
      value: 12,
      selected: false
    }
  ]

  fibonacciCards = [
    {
      id: 1,
      value: 1,
      state: false
    },
    {
      id: 2,
      value: 2,
      state: false
    },
    {
      id: 3,
      value: 3,
      state: false
    },
    {
      id: 4,
      value: 5,
      state: false
    },
    {
      id: 5,
      value: 8,
      state: false
    },
    {
      id: 6,
      value: 13,
      state: false
    },
    {
      id: 7,
      value: 21,
      state: false
    },
    {
      id: 8,
      value: 34,
      state: false
    },
    {
      id: 9,
      value: 55,
      state: false
    },
    {
      id: 10,
      value: 89,
      state: false
    },
    {
      id: 11,
      value: 144,
      state: false
    },
    {
      id: 12,
      value: 233,
      state: false
    }
  ]

  trackById(item: any): number {
    return item.id;
  }

  onCardClick(card: any): void {
    console.log("Clicked on card", card.id);
    // loop through cards and change state to false
    this.fibonacciCards.forEach((c: any) => {
      c.state = false;
    });
    card.state = true;
    // card.state = !card.state; // Toggle the state
    console.log("Card state toggled to", card.state);
    console.log("Value of the card:", card.value);
  }
  ngOnInit(): void {
    for (let card of this.regularCards) {
      card.state = false;
    }
  }

  updateSelectedCards(chosenSet: any) {
    if (chosenSet === "regular") {
      this.selectedSet = this.regularCards;
    } else if (chosenSet === "fibonacci") {
      this.selectedSet = this.fibonacciCards;
    }
    console.log(this.selectedSet); // Ensure this is after the update
  }

}
