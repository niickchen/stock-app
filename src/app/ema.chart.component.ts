import { Component, Input, EventEmitter, Output, AfterViewInit  }         from '@angular/core';
declare var Highcharts :any;

@Component({
    selector: 'app-ema-chart',
    template: `<div style="width:100%; height:80%;" id="ema-container"></div>`
})

export class EMAChartComponent implements AfterViewInit { 
    @Input() dates: string[];
    @Input() data: any[];
    @Input() symbol: string;
    @Output() plotOptions: EventEmitter<any> = new EventEmitter<any>();
    
    ngAfterViewInit() {
    	this.renderChart();
    }
 
    renderChart() {
        this.dates = this.dates.map(data => data.substring(5).replace('-', '/'));
        var options = {
                            chart: {
                                type: 'line',
                                zoomType: "x"
                            },

                            title: {
                                text: 'Exponential Moving Average (EMA)'
                            },

                            subtitle: {
                                useHTML: true,
                                text: '<a class="subtitle" href="https://www.alphavantage.co/" target="_blank" style="color:#0000EE;"> Source: Alpha Vantage </a>',
                            },

                            xAxis: {
                                categories: this.dates,
                                tickInterval: 5
                            },

                            yAxis: {
                                
                                tickAmount: 5,
                                title: {
                                    text: 'EMA'
                                }
                            },

                            tooltip: {
                                shared: false
                            },

                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            },

                            plotOptions: {
                                line: {
                                    dataLabels: {
                                        enabled: false
                                    },
                                    marker: {
                                        lineWidth: 0,
                                        enabled: false,
                                        symbol: 'square',
                                        states: {
                                            hover: {
                                                enabled: true
                                            }
                                        }
                                    }
                                }    
                            },

                            series: [{
                                name: this.symbol,
                                data: this.data,
                                color: '#66a9ff',
                                lineWidth: 2,
                                marker: 
                                {
                                    radius: 1.5
                                }
                            }],
                        };
                        
        this.plotOptions.emit(options);
        Highcharts.chart('ema-container', options);
        
    }
        
}