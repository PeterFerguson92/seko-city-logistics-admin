import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAssignDriverDialogComponent } from './order-assign-driver-dialog.component';

describe('OrderAssignDriverDialogComponent', () => {
  let component: OrderAssignDriverDialogComponent;
  let fixture: ComponentFixture<OrderAssignDriverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAssignDriverDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAssignDriverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
