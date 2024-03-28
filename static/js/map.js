
var retention_data = {};

var pict_width = 600;
var pict_height = 500;

var VlSpec = {

  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "An interactive map of Europe supporting pan and zoom.",
  "width": pict_width,
  "height": pict_height,



  "signals": [
    { "name": "tx", "update": "width / 2" },
    { "name": "ty", "update": "height / 2" },

    {
      "name": "scale",
      "value": 350,
      "on": [{
        "events": {"type": "wheel", "consume": true},
        "update": "clamp(scale * pow(1.0005, -event.deltaY * pow(16, event.deltaMode)), 150, 3000)"
      }]
    },
    {
      "name": "angles",
      "value": [0, 0],
      "on": [{
        "events": "pointerdown",
        "update": "[rotateX, centerY]"
      }]
    },
    {
      "name": "cloned",
      "value": null,
      "on": [{
        "events": "pointerdown",
        "update": "copy('projection')"
      }]
    },
    {
      "name": "start",
      "value": null,
      "on": [{
        "events": "pointerdown",
        "update": "invert(cloned, xy())"
      }]
    },
    {
      "name": "drag", "value": null,
      "on": [{
        "events": "[pointerdown, window:pointerup] > window:pointermove",
        "update": "invert(cloned, xy())"
      }]
    },
    {
      "name": "delta", "value": null,
      "on": [{
        "events": {"signal": "drag"},
        "update": "[drag[0] - start[0], start[1] - drag[1]]"
      }]
    },
    {
      "name": "rotateX", "value": 0,
      "on": [{
        "events": {"signal": "delta"},
        "update": "angles[0] + delta[0]"
      }]
    },
    {
      "name": "centerY", "value": 55,
      "on": [{
        "events": {"signal": "delta"},
        "update": "clamp(angles[1] + delta[1], -60, 60)"
      }]
    }
  ],

    "type": "geoshape",
  "projection": "projection",

  "projections": [
    {
      "name": "projection",
      "type": "mercator",

      "scale": {"signal": "scale"},
      "rotate": [{"signal": "rotateX"}, 0, 0],
       "center": [10, {"signal": "centerY"}],
      "clipExtent": [[0, 0], [pict_width, pict_height]],
      "translate": [{"signal": "tx"}, {"signal": "ty"}]
    }
  ],

  "data": [
    {
      "name": "retention",
      retention_data,
      "transform": [
      {"type": "flatten", "fields": ["retention_data.retention.bachelor.RU", "retention_data.retention.bachelor.UAS", "retention_data.retention.bachelor.BOTH"]}
      ]
    },
       {
      "name": "europe_uni",
      "values": europe_geo,
      "format": {
        "type": "topojson",
        "feature": "europe"
      },
    },
    {
      "name": "europe_uni_filtered",
      "source": "europe_uni",
      "transform": [
        {"type": "filter", "expr": "datum.id !== 'RU'"}
      ]
    },
    // {
    //   "name": "retention_countries",
    //   "source": "filtered",
    //   "transform": [
    //     {
    //       "type": "lookup",
    //       "from": "retention",
    //       "key": "country_id", // Key to match in additionalData
    //       "fields": "id", // Field in 'filtered' data to match with 'country_id' in additionalData
    //       "as": "additionalInfo"
    //     },
    //     {"type": "filter", "expr": "datum.additionalInfo !== null"} // Filter out if additional info is missing
    //   ]
    // }


  ],

  "marks": [


     {
      "type": "shape",
      "from": {"data": "europe_uni_filtered"},
      "encode": {

        "update": {
            "stroke": {"value": "white"},
          "fill": {"value": "lightblue"},
          "cursor": {"value": "pointer"}
        },
        "hover": {
          "tooltip": {
            "signal": "{'retention': datum.properties.NAME}"
          },
           "fill": {"value": "darkgreen"},

        }
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    }

    ,  {
      "type": "text",
      "from": {"data": "retention"},
      "encode": {
        "enter": {
          "text": {"field": "datum.country"},
          "x": {"field": {"group": "width"}, "mult": 0.5},
          "y": {"field": {"group": "height"}, "mult": 0.5},
          "align": {"value": "center"},
          "baseline": {"value": "middle"},
          "fill": {"value": "black"}
        }
      }
    }

  ]


      };
      vegaEmbed('#vis', VlSpec);