import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpdateDialogComponent } from './order-update-dialog.component';

describe('OrderUpdateDialogComponent', () => {
  let component: OrderUpdateDialogComponent;
  let fixture: ComponentFixture<OrderUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
