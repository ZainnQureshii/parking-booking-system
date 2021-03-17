import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss']
})
export class FeedbackListComponent implements OnInit {

  userList: any[] = []
  feedbackList: any[] = []
  pendingFeedbacks: any[] = []
  repliedFeedbacks: any[] = []

  constructor(
    private adminService: AdminService,
    private firestore: AngularFirestore) { }

  async ngOnInit() {
    await this.getAllUsers();
    this.getFeedbackList()
  }

  async getAllUsers() {
    const userDocs = (await this.adminService.getData('Users')).docs
    this.userList = await Promise.all(userDocs.map(async user => {
      const userObj: any = (await this.firestore.collection('Users').doc(user.id).get().toPromise()).data();
      return {
        uid: user.id,
        ...userObj
      }
    }))
  }

  async getFeedbackList() {
    const feedbackDocs = (await this.adminService.getData('Feedbacks')).docs
    if(feedbackDocs.length > 0) {
      this.feedbackList = feedbackDocs.map((feedback: any) => {
        const userObj = this.userList.find(user => user.uid === feedback.data().uid)
        return {
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          feedbackId: feedback.id,
          ...feedback.data()
        }
      }).sort((a: any, b: any) => (b.timestamp - a.timestamp))
      this.pendingFeedbacks = this.feedbackList.filter(feedback => feedback.state === 'pending');
      this.repliedFeedbacks = this.feedbackList.filter(feedback => feedback.state === 'replied');
    }
  }

  async reply(event) {
    try {
      const { selectedFeedback, message } = event
      const feedbackPath = this.firestore.collection('Feedbacks').doc(selectedFeedback.feedbackId)
      const feedBackData: any = (await feedbackPath.get().toPromise()).data()
      feedBackData.reply = message
      feedBackData.state = 'replied'
      await feedbackPath.update(feedBackData)
      this.getFeedbackList();
    } catch(e) {
      console.log(e)
    }
  }

}
