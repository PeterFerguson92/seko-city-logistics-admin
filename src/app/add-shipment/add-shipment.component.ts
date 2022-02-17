import { Component, OnInit, AfterContentInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatGridList } from '@angular/material/grid-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.css']
})

export class AddShipmentComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('grid') grid: MatGridList;

  gridByBreakpoint = { xl: 8, lg: 6, md: 4, sm: 2, xs: 1 };

  private mediaSub: Subscription;
  constructor(private cdRef: ChangeDetectorRef,  private mediaObservable: MediaObserver) {}



  ngOnInit() {
  }

  ngAfterContentInit() {
    this.mediaObservable.asObservable().subscribe((changes: MediaChange[]) => {
      const currentMediaChange = changes[0];
      this.grid.cols = this.gridByBreakpoint[currentMediaChange.mqAlias];
    });
  }


  ngOnDestroy(): void {
    if (this.mediaObservable)
    {
      this.mediaSub.unsubscribe();
    }
  }
}
