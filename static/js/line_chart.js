

function show_line(current_data, current_gender, institution_type_label) {


    try {

var linevis = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 555,
  "height": 200,
  "padding": 5,
  "autosize": "fit",
      "background": "white",


 "title": {
     "text":  current_gender + " retention rates in " + current_data.name,
        "subtitle": institution_type_label + " over all years",
     "fontSize": 25,
     "subtitleFontSize": 15
     },

  "data": [
   current_data
  ],


 "scales": [
    {
      "name": "x",
      "type": "point",
      "range": "width",
     "domain": {"data": current_data.name, "field": "year"},
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": current_data.name, "field": current_gender},
    },
    {
      "name": "color",
      "type": "ordinal",
      "range": "category",
      "domain": {"data": current_data.name, "field": "category"}
    }
  ],

  "axes": [
    {"orient": "bottom", "scale": "x"},
    {"orient": "left", "scale": "y", "format": "0.1%"}
  ],

  "marks": [
    {
      "type": "group",
      "from": {
        "facet": {
          "name": "series",
          "data": current_data.name,
          "groupby": "category"
        }
      },
      "marks": [
        {
          "type": "line",
          "from": {"data": "series"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "year"},
              "y": {"scale": "y", "field": current_gender},
              "stroke": {"scale": "color", "field": "category"},
              "strokeWidth": {"value": 2}
            },
            "update": {
              "interpolate": "cardinal",
              "strokeOpacity": {"value": 1}
            },
            "hover": {
              "strokeOpacity": {"value": 0.5}
            }
          }
        }
      ]
}
]
}

 vegaEmbed('#linevis', linevis);

      }
    catch(err) {
    linevis = {}
    console.log("No data for that...")
    }



 }
