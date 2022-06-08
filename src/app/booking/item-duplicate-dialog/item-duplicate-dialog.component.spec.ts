import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDuplicateDialogComponent } from './item-duplicate-dialog.component';

describe('ItemDuplicateDialogComponent', () => {
  let component: ItemDuplicateDialogComponent;
  let fixture: ComponentFixture<ItemDuplicateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemDuplicateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDuplicateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
