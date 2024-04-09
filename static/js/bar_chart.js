

function show_bar(current_data, current_gender, institution_type_label) {


current_data.values = current_data.values.filter(item => {
return item[current_gender] > 0 && item[current_gender] < 1
});
if (current_data.values.length == 0)
    current_data =  { "name": current_country + " (outliers)", "values": retention_data.bachelor[institution_type][current_country]};
/*  calculating the minimum value and adds magic 0,01 delta to view min value */
data_min = Math.min(...current_data.values.map(item => item[current_gender])) - 0.01;


var textvis =

{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 555,
  "height": 250,
  "padding": 5,
  "autosize": "fit",
      "background": "white",


 "title": {
     "text":  "Retention Rates "+ current_gender +" in " + current_data.name,
      "subtitle": institution_type_label + " starting from minimum value",
     "fontSize": 25,
     "subtitleFontSize": 15
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
      "padding": 0.5,
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
    { "orient": "left", "scale": "yscale" , "format": "0.1%"}
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":current_data.name},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "year"},
          "width": {"scale": "xscale", "band": data_max},
          "y": {"scale": "yscale", "field": current_gender},
          "y2": {"scale": "yscale", "value": data_min}
        },
        "update": {
          "fill": {"value": "steelblue"},
          "tooltip": {"field": current_gender}
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
