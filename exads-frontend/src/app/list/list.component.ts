import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../services/api.service";
import {FormUserComponent} from "../form-user/form-user.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {MyCustomPaginatorIntl} from "../MyCustomPaginatorIntl";
import {User} from "../models/user.model";


@Component({
  selector: 'exads-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['username', 'fullName', 'email', 'status', 'createdDate', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
      this.dataSource.paginator = this.paginator;
    });
  }

  getFullName(user: any): string {
    return `${user.first_name} ${user.last_name || ''}`;
  }

  getStatusColor(status: number): string {
    return status === 1 ? 'green' : 'red';
  }

  updateUser(user: User) {
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
