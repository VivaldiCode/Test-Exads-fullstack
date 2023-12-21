import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormUserComponent } from './form-user/form-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' }, // Rota padrão para / redireciona para /list
  { path: 'list', component: ListComponent },
  { path: 'newUser', component: FormUserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
