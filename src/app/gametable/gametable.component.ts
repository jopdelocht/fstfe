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
  // Cardvalues for testgame
  myCard: number = 0;
  cardBot1: number = 0;
  cardBot2: number = 0;
  objectBot1: any;
  objectBot2: any;

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

  // Changes the selected card state to true, changes all other cards state to false and stores value in myCard
  onCardClick(card: any): void {
    this.selectedSet.forEach((c: any) => {
      c.state = false;
    });
    card.state = true;
    this.myCard = card.value;
    console.log("My card:", this.myCard);

  }
  // oninit changes all states to false
  ngOnInit(): void {
    for (let card of this.regularCards && this.fibonacciCards) {
      card.state = false;
    }
  }

  updateSelectedCards(chosenSet: any) {
    if (chosenSet === "regular") {
      this.selectedSet = this.regularCards;
    } else if (chosenSet === "fibonacci") {
      this.selectedSet = this.fibonacciCards;
    }
  }


  startGame(myCard: number, cardBot1: number, cardBot2: number, objectBot1: any, objectBot2: any) {
    objectBot1 = this.selectedSet[Math.floor(Math.random() * this.selectedSet.length)];
    objectBot2 = this.selectedSet[Math.floor(Math.random() * this.selectedSet.length)];
    cardBot1 = objectBot1.value;
    cardBot2 = objectBot2.value;
    console.log("Your number:", myCard, "Bot one's card:", cardBot1, "Bot two's card:", cardBot2);
    return (this.myCard, cardBot1, this.cardBot2);
  }

}
