import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsReceiversComponent } from './bookings-receivers.component';

describe('BookingsReceiversComponent', () => {
  let component: BookingsReceiversComponent;
  let fixture: ComponentFixture<BookingsReceiversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsReceiversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsReceiversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
