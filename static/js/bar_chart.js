

function show_bar(current_data, current_gender, institution_type_label) {

    try {

    /*  calculating the minimum value and adds magic 0,01 delta to view min value */
    data_min = (Math.min(...current_data.values.map(item => item[current_gender])) - 0.1).toFixed(1);


    var textvis =

    {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "width": 575,
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
       current_data
      ],
  "legends": [

    {"fill": "color_labels", 
    "padding": 2,
    "title": "" + titleCase(current_gender) + " Rates",
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
      "domain": {"data": "countrydata", "field": current_gender},
      "range": "width",
   "domainMin": data_min,
      "nice": true
    },
    {
      "name": "color",
      "type": "ordinal",
      "domain": {"data": "countrydata", "field": "category"},
      "range": {"scheme": "category20"}

    },
        {
      "name": "color_labels",
      "type": "ordinal",
      "domain": {"data": "countrydata", "field": "country_name"},
      "range": {"scheme": "category20"}

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
          "name": "bars",
          "from": {"data": "facet"},
          "type": "rect",
          "encode": {
            "update": {
              "y": {"scale": "pos", "field": "category"},
              "height": {"scale": "pos", "band": 1},
              "x": {"scale": "xscale", "field": current_gender},
              "x2": {"scale": "xscale", "value": data_min},
              "fill": {"scale": "color", "field": "category"}
            },
            "hover": {
              "tooltip": {
                "signal":
      "{'Country': datum.country_name, 'Retention': datum." + current_gender + " }"
              },
               "fill": {"value": "lightblue"},
            },
          }
        },
        {
          "type": "text",
          "from": {"data": "bars"},
          "encode": {
            "enter": {
              "x": {"field": "x2", "offset": -5},
              "y": {"field": "y", "offset": {"field": "height", "mult": 0.5}},
              "fill": [
                {"test": "contrast('white', datum.fill) > contrast('black', datum.fill)", "value": "rgba(255,255,255,1)"},
                {"value": "rgba(0,0,0,1)"}
              ],
              "align": {"value": "right"},
              "baseline": {"value": "middle"},
             "text": [
              {"test": current_data.country_names.length + " < '4'", "field": "datum." + current_gender}]
            }
          }
        }
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
