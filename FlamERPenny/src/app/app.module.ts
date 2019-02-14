import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './service/auth.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RegisterComponent } from './components/register/register.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatSelectModule, MatProgressBarModule, MatFormFieldModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderService } from './service/order.service';
import { ProductService } from './service/product.service';
import { ClientsListComponent } from './components/clients-list/clients-list.component';
import { MatChipsModule } from '@angular/material/chips';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {MatSelect} from '@angular/material'
import {MatInputModule} from '@angular/material';
import { DispatchDateConversion } from './dispatchDateConversion.pipe';
import { OrderNewComponent } from './components/order-new/order-new.component';
import { lineaPedidoPost } from './service/lineaPedidoPost';








@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainNavComponent,
    HomeComponent,
    OrdersComponent,
    OrderDetailsComponent,
    ClientsListComponent,
    ProductsListComponent,
    PageNotFoundComponent,
    DispatchDateConversion,
    OrderNewComponent
    
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp({

      apiKey: "AIzaSyAqWRRTytavXvhAgq_pgVvoBrU0ulIozI8",
      authDomain: "loginfirebaseangular.firebaseapp.com",
      databaseURL: "https://loginfirebaseangular.firebaseio.com/",
      projectId: "loginfirebaseangular",
      storageBucket: "loginfirebaseangular.appspot.com",
      messagingSenderId: "228627189034"

    }),
    AngularFireAuthModule,
    ReactiveFormsModule,
    LayoutModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    CdkTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  
    
  ],
  providers: [AuthService, OrderService, ProductService, lineaPedidoPost],
  bootstrap: [AppComponent]
})
export class AppModule { }
