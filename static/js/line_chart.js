

function show_line(current_data, current_gender, institution_type_label) {



var linevis = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 590,
  "height": 300,
  "padding": 5,
  "autosize": "fit",
      "background": "white",


 "title": {
     "text":   titleCase(current_gender) + " Retention Rates ",
        "subtitle": "Participation trends in " + institution_type_label + " Over All Years",
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
           "range": [ "#4E79A7 ", "#F28E2B ", "#E15759 ", "#76B7B2 ", "#59A14F ", "#EDC948 ", "#B07AA1 ", "#FF9DA7 ", "#9C755F ", "#BAB0AC "],
          
    },        {
      "name": "color_labels",
      "type": "ordinal",
      "domain": current_data.country_names,
      "range": [ "#4E79A7 ", "#F28E2B ", "#E15759 ", "#76B7B2 ", "#59A14F ", "#EDC948 ", "#B07AA1 ", "#FF9DA7 ", "#9C755F ", "#BAB0AC "],

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




function show_line_genders(current_data, current_gender, institution_type_label) {

  /*  calculating the minimum value and adds magic 0,01 delta to view min value */
  var data_min = Math.min( (Math.min(...current_data.values.map(item => item["male"])) - 0.1).toFixed(1),
  (Math.min(...current_data.values.map(item => item["female"])) - 0.1).toFixed(1) );

  var    data_max = Math.max( (Math.max(...current_data.values.map(item => item["male"])) + 0.01).toFixed(1),
  (Math.max(...current_data.values.map(item => item["female"])) + 0.01).toFixed(1)  
);

var linevis = {
"$schema": "https://vega.github.io/schema/vega/v5.json",
"width": 590,
"height": 300,
"padding": 5,
"autosize": "fit",
    "background": "white",


"title": {
   "text":   " Retention Rates ",
      "subtitle": "Participation trends in " + institution_type_label + " Over All Years",
   "fontSize": 15,
   "subtitleFontSize": 10
   },

"data": [
 current_data, 
  {
      "name": "male_vs_female",
      "source": "countrydata",
      "transform": [
        {
          "type": "fold",
          "fields": ["female", "male"],
          "as": ["gender", "retention"]
        }
      ]
    }
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
    "domain": {"data": "male_vs_female", "field": "retention"},
  },
  {
    "name": "color",
    "type": "ordinal",
    "domain": {"data": "countrydata", "field": "category"},
    "range": {"scheme": "pastel2"}
  },
  {
    "name": "color2",
    "type": "ordinal",
    "domain": {"data": "countrydata", "field": "category"},
    "range": {"scheme": "dark2"}
  },
      {
    "name": "color_labels",
    "type": "ordinal",
    "domain": current_data.country_names,
    "range": {"scheme": "dark2"}
  },
  {
    "name": "color_labels2",
    "type": "ordinal",
    "domain": current_data.country_names,
    "range": {"scheme": "pastel2"}
  }
],

"legends": [

  {"fill": "color_labels", 
 
  "padding": 2,
  "title": "Male"  + " Rates",
  "offset": 0, "zindex": 1},

  {"fill": "color_labels2", 
  "padding": 2,
  "title": "Female"  + " Rates",
  "offset": 0, "zindex": 1}
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
            "y": {"scale": "y",  "field": "female"},
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
    },

      {
        "type": "line",
        "from": {"data": "series"},
        "encode": {
          "enter": {
            "x": {"scale": "x", "field": "year"},
            "y": {"scale": "y",  "field": "male"},
            "stroke": {"scale": "color2", "field": "category"},
            "strokeWidth": {"value": 2},
            "strokeDash":  {"value": [10,3]},
          },
          "update": {
            "interpolate": "cardinal",
            "strokeOpacity": {"value": 1}
          },
          "hover": {
            "strokeOpacity": {"value": 0.5},
          }
        },
      },


    ]
}
]
}
vegaEmbed('#linevis', linevis);

}
