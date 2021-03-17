import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackListTableComponent } from './feedback-list-table.component';

describe('FeedbackListTableComponent', () => {
  let component: FeedbackListTableComponent;
  let fixture: ComponentFixture<FeedbackListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
