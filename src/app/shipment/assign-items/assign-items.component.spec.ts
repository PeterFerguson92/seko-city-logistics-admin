import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignItemsComponent } from './assign-items.component';

describe('AssignItemsComponent', () => {
  let component: AssignItemsComponent;
  let fixture: ComponentFixture<AssignItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
