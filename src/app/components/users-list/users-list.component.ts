import { Component, OnInit } from '@angular/core';
import { concatMap, switchMap, concatWith } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table'

import { User } from '../../models/user'
import { UsersColumns } from '../../models/usersTableColumns'
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(private usersService: UsersService) {}

  displayedColumns: string[] = UsersColumns.map((col) => col.key);
  columnsSchema: any = UsersColumns;

  users: User[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  valid: any = {};

  ngOnInit(): void {
    this.getUsers();
  }

  addUserRowItem(): void {
    const newUser: User = {
      id: '',
      firstName: '',
      lastName: '',
      age: 0,
      dateOfBirth: '',
      phoneNumber: '',
      street: '',
      houseNumber: '',
      town: '',
      postalCode: '',
      isEdit: true
    };
    this.dataSource.data = [newUser, ...this.dataSource.data]
  }

  updateUserRowItem(user: User) {
    user.isEdit = true;
    
    if (user.id === '') {
      user.id = '00000000-0000-0000-0000-000000000000';
      user.isEdit = false;
      this.dataSource.data.push(user);
    } else {
      user.isEdit = false;
    }
  }

  removeUserRowItem(id: string) {
    this.dataSource.data = this.dataSource.data.filter((u: User) => u.id !== id);
  }

  saveChanges() {
    this.usersService.saveUsers(this.dataSource.data)
      .pipe(
        concatMap(() => {
          return this.usersService.getUsers();
        })
      )
      .subscribe(
        success => { this.dataSource = new MatTableDataSource<User>(success) },
        () => {  }
    );
  }

  cancelChanges() {
    this.getUsers();
  }

  isEdit() {
    return this.dataSource.data.some((u:User) => u.isEdit === true);
  }

  hasChanges() { 
    const result = this.dataSource.data.filter(({ id: id1 }) => !this.users.some(({ id: id2 }) => id2 === id1));
    return result.length > 0;
  }

  disableSubmit(id: string) {
    return Object.values(this.valid[id]).some((item) => item === false);
  }

  inputHandler(event: any, id: string, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {}
    }
    this.valid[id][key] = event.target.validity.valid;
  }

  private getUsers(): void {
    this.usersService.getUsers()
        .subscribe(users => {
          this.dataSource.data = users;
          this.users = users;
        });
  }
}
