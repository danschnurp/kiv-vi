var current_data =  {
      "name": "germany_ru",
      "values": [
        {
    "year": "2010/11",
    "total": 0.9221348727,
    "male": 0.9302007738,
    "female": 0.8832001487
  },
  {
    "year": "2011/12",
    "total": 0.9056166507,
    "male": 0.9081406854,
    "female": 0.8940789474
  },
  {
    "year": "2012/13",
    "total": 0.8913994368,
    "male": 0.8936696005,
    "female": 0.8818724251
  },
  {
    "year": "2013/14",
    "total": 0.8681297879,
    "male": 0.872053658,
    "female": 0.853002451
  },
  {
    "year": "2014/15",
    "total": 0.871811232,
    "male": 0.8758128517,
    "female": 0.8573607933
  },
  {
    "year": "2015/16",
    "total": 0.8658528495,
    "male": 0.8739535415,
    "female": 0.838111546
  },
  {
    "year": "2016/17",
    "total": 0.8586060872,
    "male": 0.8658218614,
    "female": 0.8341646456
  },
  {
    "year": "2017/18",
    "total": 0.856122408,
    "male": 0.8635984355,
    "female": 0.8310124365
  },
  {
    "year": "2018/19",
    "total": 0.8512442775,
    "male": 0.856281932,
    "female": 0.8345899499
  },
  {
    "year": "2019/20",
    "total": 0.8688131088,
    "male": 0.8778211525,
    "female": 0.8391030014
  },
  {
    "year": "2020/21",
    "total": 0.865843097,
    "male": 0.876456696,
    "female": 0.8300391815
  },

      ]
    };

var data_min = Math.min(...current_data.values.map(item => item.total)) - 0.001;



var textvis =

{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 800,
  "height": 200,
  "padding": 5,

  "title": "Retention in " + current_data.name + " across years in %",

  "data": [
   current_data
  ],


  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": {"data": current_data.name, "field": "year"},
      "range": "width",
      "padding": 0.45,
      "round": true
    },
    {
      "name": "yscale",
      "domain": {"data": current_data.name, "field": "total"},
      "nice": true,
      "range": "height",
      "domainMin": data_min
    }
  ],

  "axes": [
    { "orient": "bottom", "scale": "xscale" },
    { "orient": "left", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":current_data.name},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "year"},
          "width": {"scale": "xscale", "band": 1},
          "y": {"scale": "yscale", "field": "total"},
          "y2": {"scale": "yscale", "value": data_min}
        },
        "update": {
          "fill": {"value": "steelblue"},
          "tooltip": {"field": "total", "type": "quantitative"}
        },
      }
    },
    {
      "type": "text",
      "encode": {
        "enter": {
          "align": {"value": "center"},
          "baseline": {"value": "bottom"},
          "fill": {"value": "#333"}
        },

      }
    }
  ]
}

  vegaEmbed('#textvis', textvis);