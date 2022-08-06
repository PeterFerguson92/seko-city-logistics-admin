import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-shipment-report',
  templateUrl: './shipment-report.component.html',
  styleUrls: ['./shipment-report.component.css']
})
export class ShipmentReportComponent implements OnInit {
  shipment;
  constructor(private activatedroute: ActivatedRoute, private commonService: CommonService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.shipment = data.shipment;
    })
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

}
