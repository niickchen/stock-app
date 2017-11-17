import { Component, Input, EventEmitter, Output, AfterViewInit  }         from '@angular/core';
declare var Highcharts :any;

@Component({
    selector: 'app-bbands-chart',
    template: `<div style="width:100%; height:80%;" id="bbands-container"></div>`
})

export class BBANDSChartComponent implements AfterViewInit { 
    @Input() dates: string[];
    @Input() data: any[];
    @Input() symbol: string;
    @Output() plotOptions: EventEmitter<any> = new EventEmitter<any>();
    
    ngAfterViewInit() {
    	this.renderChart();
    }
 
    renderChart() {
        this.dates = this.dates.map(data => data.substring(5).replace('-', '/'));
        var lower = this.data.slice().map(data => data[2]);
        var upper = this.data.slice().map(data => data[1]);
        var middle = this.data.slice().map(data => data[0]);
        var options = {
                            chart: {
                                type: 'line',
                                zoomType: "x"
                            },

                            title: {
                                text: 'Bollinger Bands (BBANDS)'
                            },

                            subtitle: {
                                useHTML: true,
                                text: '<a href="https://www.alphavantage.co/" target="_blank" style="color:#0000EE;"> Source: Alpha Vantage </a>',
                            },

                            xAxis: {
                                categories: this.dates,
                                tickInterval: 5
                            },

                            yAxis: {
                                
                                tickAmount: 5,
                                title: {
                                    text: 'BBANDS'
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
                                name: this.symbol + ' Real Middle Band',
                                data: middle,
                                color: '#ffc34d',
                                lineWidth: 2,
                                marker: 
                                {
                                    radius: 1.5
                                }
                            },{
                                name: this.symbol + ' Real Upper Band',
                                data: upper,
                                color: '#66a9ff',
                                lineWidth: 2,
                                marker: 
                                {
                                    radius: 1.5
                                }
                            },{
                                name: this.symbol + ' Real Lower Band',
                                data: lower,
                                color: '#ff0000',
                                lineWidth: 2,
                                marker: 
                                {
                                    radius: 1.5
                                }
                            }],
                        };
                        
        this.plotOptions.emit(options);
        Highcharts.chart('bbands-container', options);
        
    }
        
}