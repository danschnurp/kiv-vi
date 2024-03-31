

function show_bar(current_data) {


var textvis =

{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 555,
  "height": 450,
  "padding":1,


 "title": {
     "text":  "Retention in " + current_data.name +  " across years in % starting from minimum value",
     "dy": 30,
     "fontSize": 13
     },

  "data": [
   current_data
  ],


  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": {"data": current_data.name, "field": "year"},
      "range": "width",
      "padding": 0.6,
      "round": true
    },
    {
      "name": "yscale",
      "domain": {"data": current_data.name, "field": current_gender},
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
          "y": {"scale": "yscale", "field": current_gender},
          "y2": {"scale": "yscale", "value": data_min}
        },
        "update": {
          "fill": {"value": "steelblue"},
          "tooltip": {"field": current_gender, "type": "quantitative"}
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
}
