import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-feedback-list-table',
  templateUrl: './feedback-list-table.component.html',
  styleUrls: ['./feedback-list-table.component.scss']
})
export class FeedbackListTableComponent implements OnInit {

  @Input() feedbackList;
  @Input() state: string
  reply: string;
  selectedFeedback;
  @Output() replyToUser = new EventEmitter()

  constructor(public functions: FunctionsService) { }

  ngOnInit(): void {
  }

}
