var textvis = 

{
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": { "years": [
        "2010/11",
        "2011/12",
        "2012/13",
        "2013/14",
        "2014/15",
        "2015/16",
        "2016/17",
        "2017/18",
        "2018/19",
        "2019/20",
        "2020/21",
        "2021/22"
      ],
      "total": [
        0.8417416951,
        0.826209709,
        0.8461054783,
        0.8468800368,
        0.8505738777,
        0.8273269954,
        0.8577488259,
        0.901317674,
        0.8520830679,
        0.8494297501,
        0.858037952,
        0.0
      ],
    
      "transform": [
        {"type": "flatten", "fields": ["years", "total"]}
        ]
    
    },

    "layer": [{
      "params": [{
        "name": "brush",
        "select": {"type": "interval", "encodings": ["x"]}
      }],
      "mark": "bar",
      "encoding": {
        "x": {
          "timeUnit": "month",
          "field": "years",
          "type": "ordinal"
        },
        "y": {
          "aggregate": "mean",
          "field": "total",
          "type": "quantitative"
        },
        "opacity": {
          "condition": {
            "param": "brush", "value": 1
          },
          "value": 0.7
        }
      }
    }, {
      "transform": [{
        "filter": {"param": "brush"}
      }],
      "mark": "rule",
      "encoding": {
        "y": {
          "aggregate": "mean",
          "field": "precipitation",
          "type": "quantitative"
        },
        "color": {"value": "firebrick"},
        "size": {"value": 3}
      }
    }]
  }
  




  vegaEmbed('#textvis', textvis);