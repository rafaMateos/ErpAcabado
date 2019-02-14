import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component' 
import { LoginComponent } from './components/login/login.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { ClientsListComponent } from './components/clients-list/clients-list.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { OrderNewComponent } from './components/order-new/order-new.component';



const routes: Routes = [

  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'hamburger', component: MainNavComponent},
  {path: 'home', component: HomeComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'newOrder', component: OrderNewComponent},
  {path: 'detail/:id', component: OrderDetailsComponent},
  {path: 'clients', component: ClientsListComponent},
  {path: 'products', component: ProductsListComponent},
  {path: '404', component: PageNotFoundComponent},
  { path: '**', redirectTo: '404', pathMatch: 'full' }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
