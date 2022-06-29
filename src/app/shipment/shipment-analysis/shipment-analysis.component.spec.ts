import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentAnalysisComponent } from './shipment-analysis.component';

describe('ShipmentAnalysisComponent', () => {
  let component: ShipmentAnalysisComponent;
  let fixture: ComponentFixture<ShipmentAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
