import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { CommonService } from 'src/app/service/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, Subject, takeUntil, tap } from 'rxjs';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { ShipmentService } from '../service/shipment.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shipment-report',
  templateUrl: './shipment-report.component.html',
  styleUrls: ['./shipment-report.component.css']
})
export class ShipmentReportComponent implements OnInit, OnDestroy {
  shipment;
  componentDestroyed$: Subject<boolean> = new Subject();
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private shipmentService: ShipmentService) { }

  ngOnInit(): void {
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    this.getShipmentByReference(reference);
  }

  getShipmentByReference(reference) {
    this.spinner.show();
    this.shipmentService.getShipmentByReference(reference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
        if (result.data)
          {
            this.shipment = result.data.shipmentByReference;
          } else
          {
            this.router.navigate(['/not-found']);
          }
          this.spinner.hide()
        },
      error: () => {
        this.spinner.hide()
        this.dialog.open(InfoDialogComponent, {
          height: '25%',
          width: '30%',
          data: { message: `Sorry couldn't retrieve shipment with reference ${reference}` }
        });
      }
    })
  }

  showSummary() {
    return this.shipment ? true : false;
  }

  getFormattedDate(date) {
    return date ? this.commonService.getFormattedDate(date) : '';
  }

  exportAsPDF() {
    const summary = document.getElementById('summary');
    const height = summary.clientHeight;
    const width = summary.clientWidth;
    const options = { background: 'white', width , height };

    domtoimage.toPng(summary, options).then((imgData) => {
      const doc = new jsPDF(width > height ? 'l' : 'p', 'mm', [width, height]);
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('booking_'+ this.shipment.reference + '.pdf');
    })
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
