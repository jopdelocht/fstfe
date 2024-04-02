import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GametableplayerComponent } from './gametableplayer.component';

describe('GametableplayerComponent', () => {
  let component: GametableplayerComponent;
  let fixture: ComponentFixture<GametableplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GametableplayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GametableplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
