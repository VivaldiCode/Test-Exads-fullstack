import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'exads-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
  }

  changeLanguage(event: any) {
    const newLang = event.target.value;
    this.translateService.use(newLang);
  }

  addNewUser() {
    // Adicione a lógica para adicionar um novo usuário aqui
    console.log('Novo usuário adicionado!');
  }
}

