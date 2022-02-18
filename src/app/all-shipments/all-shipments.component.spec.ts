import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShipmentsComponent } from './all-shipments.component';

describe('AllShipmentsComponent', () => {
  let component: AllShipmentsComponent;
  let fixture: ComponentFixture<AllShipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllShipmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
