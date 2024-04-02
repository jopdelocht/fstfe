import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GametableadminComponent } from './gametableadmin.component';

describe('GametableadminComponent', () => {
  let component: GametableadminComponent;
  let fixture: ComponentFixture<GametableadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GametableadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GametableadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
