import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: '**', component: MapComponent }

]
@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    FormsModule ,
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDdEeWmWMG4K9Z_OMOrriSKhjBABXAr8xk'
    }),
    SocketIoModule.forRoot(config)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
