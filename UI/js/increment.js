
var chartData = [];

function generateChartData() {
var firstDate = new Date();
firstDate.setHours( 0, 0, 0, 0 );
firstDate.setDate( firstDate.getDate() - 2000 );

for ( var i = 0; i < 2000; i++ ) {
  var newDate = new Date( firstDate );

  newDate.setDate( newDate.getDate() + i );

  var open = Math.round( Math.random() * ( 30 ) + 100 );
  var close = open + Math.round( Math.random() * ( 15 ) - Math.random() * 10 );

  var low;
  if ( open < close ) {
    low = open - Math.round( Math.random() * 5 );
  } else {
    low = close - Math.round( Math.random() * 5 );
  }

  var high;
  if ( open < close ) {
    high = close + Math.round( Math.random() * 5 );
  } else {
    high = open + Math.round( Math.random() * 5 );
  }

  var volume = Math.round( Math.random() * ( 1000 + i ) ) + 100 + i;


  chartData[ i ] = ( {
    "date": newDate,
    "open": open,
    "close": close,
    "high": high,
    "low": low,
    "volume": volume
  } );
}
}

generateChartData();

var chart = AmCharts.makeChart( "chartdiv", {
"type": "stock",
"theme": "light",
"dataSets": [ {
  "fieldMappings": [ {
    "fromField": "open",
    "toField": "open"
  }, {
    "fromField": "close",
    "toField": "close"
  }, {
    "fromField": "high",
    "toField": "high"
  }, {
    "fromField": "low",
    "toField": "low"
  }, {
    "fromField": "volume",
    "toField": "volume"
  }, {
    "fromField": "value",
    "toField": "value"
  } ],
  "color": "#7f8da9",
  "dataProvider": chartData,
  "categoryField": "date"
} ],
"balloon": {
  "horizontalPadding": 13
},
"panels": [ {
  "title": "Value",
  "stockGraphs": [ {
    "id": "g1",
    "type": "candlestick",
    "openField": "open",
    "closeField": "close",
    "highField": "high",
    "lowField": "low",
    "valueField": "close",
    "lineColor": "#7f8da9",
    "fillColors": "#7f8da9",
    "negativeLineColor": "#db4c3c",
    "negativeFillColors": "#db4c3c",
    "fillAlphas": 1,
    "balloonText": "open:<b>[[open]]</b><br>close:<b>[[close]]</b><br>low:<b>[[low]]</b><br>high:<b>[[high]]</b>",
    "useDataSetColors": false
  } ]
} ],
"scrollBarSettings": {
  "graphType": "line",
  "usePeriod": "WW"
},
"panelsSettings": {
  "panEventsEnabled": true
},
"cursorSettings": {
  "valueBalloonsEnabled": true,
  "valueLineBalloonEnabled": true,
  "valueLineEnabled": true
},
"periodSelector": {
  "position": "bottom",
  "periods": [ {
    "period": "DD",
    "count": 10,
    "label": "10 days"
  }, {
    "period": "MM",
    "selected": true,
    "count": 1,
    "label": "1 month"
  }, {
    "period": "YYYY",
    "count": 1,
    "label": "1 year"
  }, {
    "period": "YTD",
    "label": "YTD"
  }, {
    "period": "MAX",
    "label": "MAX"
  } ]
}
} );

var secondchart = AmCharts.makeChart("secondchartdiv", {
    "type": "serial",
    "theme": "light",
    "marginRight": 80,
    "dataProvider": [{
        "lineColor": "#b7e021",
        "date": "2012-01-01",
        "duration": 408
    }, {
        "date": "2012-01-02",
        "duration": 482
    }, {
        "date": "2012-01-03",
        "duration": 562
    }, {
        "date": "2012-01-04",
        "duration": 379
    }, {
        "lineColor": "#fbd51a",
        "date": "2012-01-05",
        "duration": 501
    }, {
        "date": "2012-01-06",
        "duration": 443
    }, {
        "date": "2012-01-07",
        "duration": 405
    }, {
        "date": "2012-01-08",
        "duration": 309,
        "lineColor": "#2498d2"
    }, {
        "date": "2012-01-09",
        "duration": 287
    }, {
        "date": "2012-01-10",
        "duration": 485
    }, {
        "date": "2012-01-11",
        "duration": 890
    }, {
        "date": "2012-01-12",
        "duration": 810
    }],
    "balloon": {
        "cornerRadius": 6,
        "horizontalPadding": 15,
        "verticalPadding": 10
    },
    "valueAxes": [{
        "duration": "mm",
        "durationUnits": {
            "hh": "h ",
            "mm": "min"
        },
        "axisAlpha": 0
    }],
    "graphs": [{
        "bullet": "square",
        "bulletBorderAlpha": 1,
        "bulletBorderThickness": 1,
        "fillAlphas": 0.3,
        "fillColorsField": "lineColor",
        "legendValueText": "[[value]]",
        "lineColorField": "lineColor",
        "title": "duration",
        "valueField": "duration"
    }],
    "chartScrollbar": {

    },
    "chartCursor": {
        "categoryBalloonDateFormat": "YYYY MMM DD",
        "cursorAlpha": 0,
        "fullWidth": true
    },
    "dataDateFormat": "YYYY-MM-DD",
    "categoryField": "date",
    "categoryAxis": {
        "dateFormats": [{
            "period": "DD",
            "format": "DD"
        }, {
            "period": "WW",
            "format": "MMM DD"
        }, {
            "period": "MM",
            "format": "MMM"
        }, {
            "period": "YYYY",
            "format": "YYYY"
        }],
        "parseDates": true,
        "autoGridCount": false,
        "axisColor": "#555555",
        "gridAlpha": 0,
        "gridCount": 50
    },
    "export": {
        "enabled": true
    }
});



secondchart.addListener("dataUpdated", zoomChart);

function zoomChart() {
    secondchart.zoomToDates(new Date(2012, 0, 3), new Date(2012, 0, 11));
}
