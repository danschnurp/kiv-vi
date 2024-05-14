

function show_bar_genders(current_data, current_gender, institution_type_label) {

    try {

    /*  calculating the minimum value and adds magic 0,01 delta to view min value */
    data_min = Math.min( (Math.min(...current_data.values.map(item => item["male"])) - 0.1).toFixed(1),
    (Math.min(...current_data.values.map(item => item["female"])) - 0.1).toFixed(1)  
  );


    var textvis =

    {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": 555,
      "height": 850,
      "padding": 5,
      "autosize": "fit",
          "background": "white",


     "title": {
         "text": "  Retention Rates in Informatics Studies across European Countries  ",
          "subtitle": institution_type_label + " Starting from Minimum Value over non-empty and non-outlier years." ,
         "fontSize": 15,
         "subtitleFontSize": 13,
         "padding": 20
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
  "legends": [

    {"fill": "color_labels", 
    "fillOpacity": {"value": 0.5},
    "padding": 2,
    "title": "Male"  + " Rates",
    "offset": 0, "zindex": 1},

    {"fill": "color_labels2", 
         "fillOpacity": {"value": 0.5},
    "padding": 2,
    "title": "Female"  + " Rates as outlines",
    "offset": 0, "zindex": 1}
  ],

    "scales": [
    {
      "name": "yscale",
      "type": "band",
      "domain": {"data": "countrydata", "field": "year"},
      "range": "height",
      "padding": 0.2,
      "nice": true
    },
    {
      "name": "xscale",
      "type": "linear",
      "domain": {"data": "male_vs_female", "field": "retention"},
      "range": "width",
   "domainMin": data_min,
      "nice": true
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
      "domain": {"data": "countrydata", "field": "country_name"},
      "range": {"scheme": "dark2"}
    },
    {
      "name": "color_labels2",
      "type": "ordinal",
 
    }
  ],

  "axes": [
    {"orient": "left", "scale": "yscale", "tickSize": 0, "labelPadding": 4, "zindex": 1},
    {"orient": "top", "scale": "xscale", "format": "0.1%", "grid": true},
    {"orient": "bottom", "scale": "xscale", "format": "0.1%"}
  ],

  "marks": [
    {
      "type": "group",

      "from": {
        "facet": {
          "data": "countrydata",
          "name": "facet",
          "groupby": "year"
        }
      },

      "encode": {
        "enter": {
          "y": {"scale": "yscale", "field": "year"}
        }
      },

      "signals": [
        {"name": "height", "update": "bandwidth('yscale')"}
      ],

      "scales": [
        {
          "name": "pos",
          "type": "band",
          "range": "height",
          "domain": {"data": "facet", "field": "category"}
        }
      ],

      "marks": [
      
        {
          "name": "bar2",
          "from": {"data": "facet"},
          "type": "rect",
          "encode": {
            "update": {
              "y": {"scale": "pos", "field": "category"},
              "height": {"scale": "pos", "band": 1},
              "x": {"scale": "xscale", "field": "male"},
              "x2": {"scale": "xscale", "value": data_min},
              "fill": {"scale": "color2", "field": "category"},
              "fillOpacity": {"value": 0.5}
            },
            "hover": {
              "tooltip": {
                "signal":
      "{'Country': datum.country_name , 'Male': datum.male}"
              },
 
            },
          }
        },  {
          "name": "bars",
          "from": {"data": "facet"},
          "type": "rect",
          "encode": {
            "update": {
              "y": {"scale": "pos", "field": "category"},
              "height": {"scale": "pos", "band": 1},
              "x": {"scale": "xscale", "field": "female"},
              "x2": {"scale": "xscale", "value": data_min},
              "fill": {"value": "rgba(0,0,0,0)"},
              "fillOpacity": {"value": 0.5},
              "stroke": {"value": "black"},

            },
            "hover": {
              "tooltip": {
                "signal": 
      "{ 'Country': datum.country_name , 'Female': datum.female}"
              },

            },
          }
        },
      ]
    }
  ]
    }
  vegaEmbed('#textvis', textvis);


      }
    catch(err) {
    textvis = {}
  vegaEmbed('#textvis', textvis);
    }

}
