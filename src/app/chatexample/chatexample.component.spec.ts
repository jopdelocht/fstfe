import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatexampleComponent } from './chatexample.component';

describe('ChatexampleComponent', () => {
  let component: ChatexampleComponent;
  let fixture: ComponentFixture<ChatexampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatexampleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatexampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
