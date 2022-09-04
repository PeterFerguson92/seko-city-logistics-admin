import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateItemsDialogComponent } from './update-items-dialog.component';

describe('UpdateItemsDialogComponent', () => {
  let component: UpdateItemsDialogComponent;
  let fixture: ComponentFixture<UpdateItemsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateItemsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateItemsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
