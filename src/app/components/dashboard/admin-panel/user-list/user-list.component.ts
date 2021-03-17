import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userList: any[] = []

  constructor(private adminService: AdminService, public functions: FunctionsService) { }

  ngOnInit(){
    this.getUserList()
  }

  async getUserList() {
    const userDocs = (await this.adminService.getData('Users')).docs
    if(userDocs.length > 0) {
      this.userList = userDocs.map(user => user.data())
    }
  }

}
