import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-bookings-table',
  templateUrl: './bookings-table.component.html',
  styleUrls: ['./bookings-table.component.scss']
})
export class BookingsTableComponent implements OnInit {

  @Input() bookings;
  @Input() state;
  @Output() cancelBooking = new EventEmitter();
  selectedBooking;

  constructor(public functions: FunctionsService) { }

  ngOnInit(): void {
  }

}
