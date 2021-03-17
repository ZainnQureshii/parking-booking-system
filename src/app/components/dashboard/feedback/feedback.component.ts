import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  feedbackString: string;
  success: boolean;
  previousFeedbacks: any[] = []
  reply: string;

  constructor(
      private firestore: AngularFirestore,
      private authService: AuthService,
      public functions: FunctionsService) { }

  ngOnInit(): void {
    this.getUserFeedbacks();
  }

  async getUserFeedbacks() {
    try {
      const feedbackDocs = (await this.firestore.collection('Feedbacks', ref => ref
      .where('uid', '==', this.authService.user.uid)).get().toPromise()).docs
      if(feedbackDocs.length > 0) {
        this.previousFeedbacks = feedbackDocs.map(feedback => feedback.data()).sort((a: any, b: any) => b.timestamp - a.timestamp)
      }
    } catch(e) {
      console.log(e)
    }
  }

  async submitFeedback(feedback: string) {
    this.success = false
    try {
      if(feedback) {
        await this.firestore.collection('Feedbacks').add({
          timestamp: Date.now(),
          uid: this.authService.user.uid,
          content: feedback,
          state: 'pending'
        })
        this.success = true;
        this.feedbackString = '';
        this.ngOnInit()
      }
    } catch(e) {
      console.log(e)
    }
  }

}
