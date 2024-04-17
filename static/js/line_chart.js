

function show_line(current_data, current_gender, institution_type_label) {



var linevis = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 590,
  "height": 150,
  "padding": 5,
  "autosize": "fit",
      "background": "white",


 "title": {
     "text":  titleCase(current_gender) + " Retention Rates ",
        "subtitle": institution_type_label + " Over All Years",
     "fontSize": 15,
     "subtitleFontSize": 10
     },

  "data": [
   current_data
  ],


 "scales": [
    {
      "name": "x",
      "type": "point",
      "range": "width",
     "domain": {"data": "countrydata", "field": "year"},
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": "countrydata", "field": current_gender},
    },
    {
      "name": "color",
      "type": "ordinal",
      "range": "category",
      "domain": {"data": "countrydata", "field": "category"},
           "range": {"scheme": "category20"}
    },        {
      "name": "color_labels",
      "type": "ordinal",
      "domain": current_data.country_names,
      "range": {"scheme": "category20"}

    }
  ],

    "legends": [
    {"fill": "color_labels", "offset": 0, "zindex": 1}
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
          "data": "countrydata",
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
