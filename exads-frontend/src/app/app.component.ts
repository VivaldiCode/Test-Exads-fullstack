import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {User} from "./models/user.model";
import {FormUserComponent} from "./form-user/form-user.component";
import {ApiService} from "./services/api.service";

@Component({
  selector: 'exads-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private translateService: TranslateService,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {
    this.translateService.setDefaultLang('en');
  }

  changeLanguage(newLang: string) {
    this.translateService.use(newLang);
  }

  addNewUser() {
    const newUser = new User(-1, '', '', '', '', '', 1);
    this.openUserModal(newUser);
  }

  private openUserModal(user: User): void {
    const dialogRef = this.dialog.open(FormUserComponent, {
      width: '600px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Novo usuário adicionado:', result);

        this.apiService.updateUser(user).subscribe(() => {

        });


      }
    });
  }
}

