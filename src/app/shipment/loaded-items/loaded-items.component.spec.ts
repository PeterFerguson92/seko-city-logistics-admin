import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadedItemsComponent } from './loaded-items.component';

describe('LoadedItemsComponent', () => {
  let component: LoadedItemsComponent;
  let fixture: ComponentFixture<LoadedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadedItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
