import {Component, OnInit, AfterViewInit} from '@angular/core';
import {AmChartsService, AmChart} from '@amcharts/amcharts3-angular';
import {ChartService} from '../services/chart.service';
import {Subscription} from 'rxjs/Subscription';
import {textDef} from '@angular/core/src/view';

@Component({
    selector: 'charts',
    templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit {
    public chart: AmChart;
    chartData1 = [];
    baseToken: Subscription;
    quoteToken: Subscription;
    tokenname: Subscription;
    tokenQuotename: Subscription;
    public tokenBaseName: any;
    public tokenQuoteName: any;
    theme: any;
    basedata: any;
    Quotedata: any;
    chartData2 = [];
    chartData3 = [];
    chartData4 = [];
    dataSets = [];

    constructor(private AmCharts: AmChartsService, private chartservice: ChartService) {
        this.baseToken = this.chartservice.chartBaseData$.subscribe(
            item => {
                if (item) {
                    console.log("item base", item);
                    this.basedata = item["Data"];
                    this.generateChartData();
                }

            });
        this.quoteToken = this.chartservice.chartQuoteData$.subscribe(
            item => {
                if (item) {
                    console.log("item quote", item);
                    this.Quotedata = item["Data"];
                    this.generateChartData();
                }

            });
        this.tokenname = this.chartservice.tokenBaseName$.subscribe(
            item => {
                if (item) {
                    this.tokenBaseName = item

                }
            });
        this.tokenQuotename = this.chartservice.tokenQuoteName$.subscribe(
            item => {
                if (item) {
                    this.tokenQuoteName = item
                }
            });
    }

    ngOnInit() {
        console.log("Chart component initialized");
    }

    generateChartData() {
        if (this.basedata) {
            this.dataSets = [];
            let temp = this.basedata;
            this.chartData1 = [];
            let finalLength = this.basedata.length;
            for (let i = 0; i < temp.length; i++) {
                this.chartData1.push({
                    'date': new Date(temp[i].time * 1000),
                    'value': temp[i].close,
                    'volume': temp[i].open
                });
            }
            if (finalLength === this.chartData1.length) {
                console.log("called basedata");
                this.dataSets.push({
                    "title": this.tokenBaseName,
                    "fieldMappings": [{
                        "fromField": "value",
                        "toField": "value"
                    }, {
                        "fromField": "volume",
                        "toField": "volume"
                    }],
                    "dataProvider": this.chartData1,
                    "categoryField": "date",
                })
                if (this.Quotedata) {
                    console.log("called Quotedata 1")
                    let temp = this.Quotedata;
                    this.chartData2 = [];
                    let finalLength = this.Quotedata.length;
                    for (let i = 0; i < temp.length; i++) {
                        this.chartData2.push({
                            'date': new Date(temp[i].time * 1000),
                            'value': temp[i].close,
                            'volume': temp[i].open
                        });
                    }
                    if (finalLength === this.chartData2.length) {
                        console.log("called Quotedata")
                        this.dataSets.push({
                            "title": this.tokenQuoteName,
                            "fieldMappings": [{
                                "fromField": "value",
                                "toField": "value"
                            }, {
                                "fromField": "volume",
                                "toField": "volume"
                            }],
                            "dataProvider": this.chartData2,
                            "categoryField": "date",
                            "compared": true
                        })
                        console.log("datasets", this.dataSets);
                        this.chart = this.AmCharts.makeChart("chartdiv", {
                            "type": "stock",
                            "theme": "light",
                            autoMargins: false,
                            'categoryAxesSettings': {
                                'minPeriod': 'mm'
                            },
                            "dataSets": this.dataSets,
                            "panels": [{
                                "showCategoryAxis": false,
                                "title": "Tokens",
                                recalculateToPercents: false,
                                "percentHeight": 50,
                                "stockGraphs": [{
                                    "id": "g1",
                                    "valueField": "value",
                                    "comparable": true,
                                    "compareField": "value",
                                    "balloonText": "[[title]]:<b>[[value]]</b>",
                                    "compareGraphBalloonText": "[[title]]:<b>[[value]]</b>",
                                    type: 'line'
                                }],
                                'stockLegend': {
                                    'periodValueTextComparing': '[[percents.value.close]]%',
                                    'periodValueTextRegular': '[[value.close]]'
                                }
                            }],

                            "chartScrollbarSettings": {
                                "graph": "g1"
                            },

                            "chartCursorSettings": {
                                "valueBalloonsEnabled": true,
                                "fullWidth": true,
                                "cursorAlpha": 0.1,
                                "valueLineBalloonEnabled": true,
                                "valueLineEnabled": true,
                                "valueLineAlpha": 0.5
                            }
                        });
                    }
                }
            }
        }


    }


}
