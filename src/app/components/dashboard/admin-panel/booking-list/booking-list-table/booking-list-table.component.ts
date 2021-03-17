import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-booking-list-table',
  templateUrl: './booking-list-table.component.html',
  styleUrls: ['./booking-list-table.component.scss']
})
export class BookingListTableComponent implements OnInit {

  @Input() bookings;
  @Input() state;
  @Output() cancelBooking = new EventEmitter();
  selectedBooking;

  constructor(public functions: FunctionsService) { }

  ngOnInit(): void {
  }

}
