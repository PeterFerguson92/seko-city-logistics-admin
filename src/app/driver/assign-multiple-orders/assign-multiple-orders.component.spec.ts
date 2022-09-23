import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMultipleOrdersComponent } from './assign-multiple-orders.component';

describe('AssignMultipleOrdersComponent', () => {
  let component: AssignMultipleOrdersComponent;
  let fixture: ComponentFixture<AssignMultipleOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignMultipleOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMultipleOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
