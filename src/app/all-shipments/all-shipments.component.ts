import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-all-shipments',
  templateUrl: './all-shipments.component.html',
  styleUrls: ['./all-shipments.component.css']
})
export class AllShipmentsComponent implements OnInit, OnDestroy, AfterViewInit {


   ELEMENT_DATA = [
    {id: 7636431, origin: 'MK109LF', destination: 'ACCRA', date: '22/11/2022'},
    {id: 23535, origin: 'MK12LTR', destination: 'KUMASI', date: '22/11/2022'},
    {id: 35353, origin: 'MK3RTY', destination: 'CAPECOAST', date: '10/05/2021'},
    {id: 34354, origin: 'MK12EDS', destination: 'KUMASI', date: '22/11/2022'},
    {id: 535353, origin: 'MK117TE', destination: 'KUMASI', date: '22/11/2022'},
    {id: 3535, origin: 'MK428RF', destination: 'KUMASI', date: '23/10/2021'},
     { id: 23141, origin: 'MK42OHR', destination: 'ACCRA', date: '23/09/2021' },
    {id: 2727262, origin: 'MK428RF', destination: 'ACCRA', date:  '10/05/2021'},
    {id: 9737373, origin: 'MK428RF', destination:'CAPECOAST', date:'23/09/2021' },
     { id: 161610, origin: 'MK3RTY', destination: 'CAPECOAST', date: '23/09/2021'  },
     {id: 6462531, origin: 'MK117TE', destination: 'CAPECOAST', date: '11/08/2021'},
     {id: 22424, origin: 'MK428RF', destination: 'KUMASI', date:  '10/05/2021'},
     {id:73737, origin: 'MK42OHR', destination: 'ACCRA', date: '11/09/2021'},
     {id: 46464, origin: 'MK428RF', destination:'KUMASI', date: '11/09/2021'},
     {id: 254424, origin: 'MK428RF', destination: 'KUMASI', date: '11/09/2021'},
     {id: 4242424, origin: 'MK109LF', destination: 'ACCRA', date: '11/09/2021'},
     {id: 12313, origin: 'MK3RTY', destination: 'KUMASI', date:  '10/02/2021'},
     {id: 80949, origin: 'MK109LF', destination: 'ACCRA', date: '10/11/2021'},
     {id: 9837373, origin: 'MK3RTY', destination: 'KUMASI', date: '10/12/2021'},
     {id: 10828282, origin: 'MK109LF', destination: 'KUMASI', date: '22/11/2022'}
   ];

  displayedColumns: string[] = ['ID', 'ORIGIN', 'DESTINATION', 'DATE', 'ACTION'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor() {
    if (!localStorage.getItem('foo'))
    {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {

  }
}


