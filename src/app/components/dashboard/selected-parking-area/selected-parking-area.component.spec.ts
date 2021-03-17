import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedParkingAreaComponent } from './selected-parking-area.component';

describe('SelectedParkingAreaComponent', () => {
  let component: SelectedParkingAreaComponent;
  let fixture: ComponentFixture<SelectedParkingAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedParkingAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedParkingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
