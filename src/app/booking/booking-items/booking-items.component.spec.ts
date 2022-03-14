import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingItemsComponent } from './booking-items.component';

describe('BookingItemsComponent', () => {
  let component: BookingItemsComponent;
  let fixture: ComponentFixture<BookingItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
