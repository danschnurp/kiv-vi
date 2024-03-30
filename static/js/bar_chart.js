

function show_bar(current_data) {

current_data.values = current_data.values.filter(item => {

return item.total > 0 && item.total < 1

});

/*  calculating the minimum value and adds delta to view min value */
var data_min = Math.min(...current_data.values.map(item => item.total)) - 0.001;


var textvis =

{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 555,
  "height": 200,
  "padding":1,

  "title": "Retention in " + current_data.name + " across years in % starting from minimum value",


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
}
show_bar(current_data);