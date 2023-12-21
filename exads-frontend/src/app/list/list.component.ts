import {Component, OnInit} from '@angular/core';
import {MatLegacyTableDataSource as MatTableDataSource} from "@angular/material/legacy-table";
import {data} from "./mockData";
import {ApiService} from "../services/api.service";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {FormUserComponent} from "../form-user/form-user.component";


@Component({
  selector: 'exads-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['username', 'fullName', 'email', 'status', 'createdDate', 'actions'];
  dataSource: MatTableDataSource<any>;
  constructor(private apiService: ApiService, private dialog: MatDialog) {}
  ngOnInit() {
    this.fetchUsers();
  }

  openEditDialog(user: any) {
    const dialogRef = this.dialog.open(FormUserComponent, {
      width: '600px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateUser(result);
      }
    });
  }
  fetchUsers() {
    this.apiService.getUsers().subscribe((users) => {
      this.dataSource = new MatTableDataSource(users);
    });
  }

  getFullName(user: any): string {
    return `${user.first_name} ${user.last_name || ''}`;
  }

  getStatusColor(status: number): string {
    return status === 1 ? 'green' : 'red';
  }

  createUser() {
    const newUser = {
      first_name: 'New',
      last_name: 'User',
      email: 'newuser@example.com',
      username: 'newuser',
      created_date: new Date().toISOString(),
      id_status: 1,
    };

    this.apiService.createUser(newUser).subscribe(() => {
      this.fetchUsers();
    });
  }

  updateUser(user: any) {
    this.apiService.updateUser(user).subscribe(() => {
      this.fetchUsers();
    });
  }

  deleteUser(userId: number) {
    this.apiService.deleteUser(userId).subscribe(() => {
      this.fetchUsers();
    });
  }
}
