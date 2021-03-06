import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IBooking } from 'src/app/booking/model';
import { ItemService } from 'src/app/booking/service/items/item.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-assign-items',
  templateUrl: './assign-items.component.html',
  styleUrls: ['./assign-items.component.css', '../../shared/shared-table.css','../../shared/shared-new-form.css']
})
export class AssignItemsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() bookings: [IBooking] = null;
  displayedColumns: string[] = ['ASSIGNED', 'SENDER FULL NAME', 'DESTINATION', 'PICK-UP DATE', 'TYPE',
    'DESCRIPTION', 'VALUE', 'AMOUNT', 'ACTION'];
  selection = new SelectionModel<IBooking>(true, []);
  selectedShipmentForm: FormGroup;
  shipments;
  shipmentsObjs;
  dataSource = null;
  height =  '80%';
  width = '65%';
  SHIPMENT_SELECTION_MESSAGE = 'Please select shipment';
  shipmentList = [];

  constructor(private router: Router, private activatedroute: ActivatedRoute,
    private itemService: ItemService,private formBuilder: FormBuilder,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      const items = data.info[0].data.eligibleItems;
      this.dataSource = items.length > 0 ? new MatTableDataSource(this.buildItemsData(items)) : new MatTableDataSource(null);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.shipmentsObjs = data.info[1].data.shipments;
      this.shipments = this.getShipmentsDetailsList(this.shipmentsObjs)
      this.selectedShipmentForm = this.formBuilder.group({selectedShipment: [this.shipmentList[0]]});
    })
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

  isSelected(element) {
    this.selection.isSelected(element);
    return element.shipmentReference === this.activatedroute.snapshot.params.reference;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  isDisabled() {
    return this.SHIPMENT_SELECTION_MESSAGE === this.getFormControl('selectedShipment').value;
  }

  onAssign() {
    const itemsIdsToAssign = [];
    this.dataSource.data.forEach(row => {
    if (this.selection.isSelected(row))
      {
        itemsIdsToAssign.push(row.itemId)
      }
    });
    this.assignItemsToShipment(itemsIdsToAssign)
  }

  assignItemsToShipment(itemsIdsToAssign) {
    const shipmentReference = this.getShipmentReferenceFromSelection();
    if (shipmentReference)
    {
      const fieldToUpdate = { name: 'shipmentReference', value: shipmentReference };
      this.itemService.updateItemsById(itemsIdsToAssign, fieldToUpdate).subscribe(
        ({ data }) => {
           location.reload();  // TODO handle properly
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  getShipmentReferenceFromSelection() {
    const shipmentSelection = this.getFormControl('selectedShipment').value;
    return this.shipmentsObjs.find(shipment =>
        shipment.containerNumber === shipmentSelection.containerNumber).reference;
  }

  getShipmentsDetailsList(shipments) {
    const shipmentsDetails: string[] = [];
    shipmentsDetails.push(this.SHIPMENT_SELECTION_MESSAGE)
    shipments.forEach((shipment) => {
      this.shipmentList.push({containerNumber: shipment.containerNumber, loadingDate: shipment.loadingDate })
    })
    return shipmentsDetails
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value.containerNumber);
    fControl.markAsDirty();
  }

   getFormControl(fControlName: string) {
    return this.selectedShipmentForm.get(fControlName)
   }

   onViewBooking(reference) {
    this.router.navigate(['/booking-summary', reference]);
   }

  buildItemsData(results) {
    const resultData = []
    for (const result of results) {
      resultData.push(this.mergeData(result.item, result.booking))
    }
    return resultData;
  }

  mergeData(item, booking) {
    const itemCopy = { ...item };
    // tslint:disable-next-line:no-string-literal
    itemCopy['itemId'] = item.id
    return { ...itemCopy, ...booking };
  }

}
