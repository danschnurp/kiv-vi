
var yourVlSpec = {

  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "An interactive map of Europe supporting pan and zoom.",
  "width": 600,
  "height": 300,



  "signals": [
    { "name": "tx", "update": "width / 2" },
    { "name": "ty", "update": "height / 2" },

    {
      "name": "scale",
      "value": 100,
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
      "name": "centerY", "value": 0,
      "on": [{
        "events": {"signal": "delta"},
        "update": "clamp(angles[1] + delta[1], -60, 60)"
      }]
    }
  ],

  "projections": [
    {
      "name": "projection",
      "type": "mercator",

      "scale": {"signal": "scale"},
      "rotate": [{"signal": "rotateX"}, 0, 0],
      "center": [10, {"signal": "centerY"}],
      "translate": [{"signal": "tx"}, {"signal": "ty"}]
    }
  ],

  "data": [
    {
      "name": "europe",
      "url": "./data/europe_geo.json",
      "format": {
        "type": "topojson",
        "feature": "countries"
      }
    },
       {
      "name": "europe_uni",
      "url": "./data/europe_geo_filtered.json",
      "format": {
        "type": "topojson",
        "feature": "countries"
      }
    }
  ],

  "marks": [

    {
      "type": "shape",
      "from": {"data": "europe"},
      "encode": {
        "enter": {
          "strokeWidth": {"value": 0.5},
          "stroke": {"value": "white"},
          "fill": {"value": "lightgray"}
        }
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    }  ,  {
      "type": "shape",
      "from": {"data": "europe_uni"},
      "encode": {
        "enter": {
          "strokeWidth": {"value": 0.5},
          "stroke": {"value": "white"},
          "fill": {"value": "lightblue"}
        }
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    }
  ]


      };
      vegaEmbed('#vis', yourVlSpec);