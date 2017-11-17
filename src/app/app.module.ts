import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { ResultComponent } from './result.component';
import { FavoriteComponent } from './favorite.component';
import { DetailComponent } from './detail.component';
import { PriceChartComponent } from './price.chart.component';
import { ADXChartComponent } from './adx.chart.component';
import { BBANDSChartComponent } from './bbands.chart.component';
import { CCIChartComponent } from './cci.chart.component';
import { EMAChartComponent } from './ema.chart.component';
import { MACDChartComponent } from './macd.chart.component';
import { RSIChartComponent } from './rsi.chart.component';
import { SMAChartComponent } from './sma.chart.component';
import { STOCHChartComponent } from './stoch.chart.component';
import { HistoryChartComponent } from './history.chart.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultComponent,
    FavoriteComponent,
    DetailComponent,
    PriceChartComponent,
    STOCHChartComponent,
    SMAChartComponent,
    RSIChartComponent,
    MACDChartComponent,
    EMAChartComponent,
    CCIChartComponent,
    BBANDSChartComponent,
    ADXChartComponent,
    HistoryChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    RouterModule.forRoot([
        {
            path: '',
            redirectTo: 'favorite',
            pathMatch: 'full'
        },
        {
            path: 'detail',
            component: DetailComponent
        },
        {
            path: 'favorite',
            component: FavoriteComponent
        }
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

