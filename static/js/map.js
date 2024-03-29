
var institution_type = document.getElementById("institution_type").value;

document.getElementById("institution_type").addEventListener("change", function() {

institution_type = this.value;
console.log(institution_type);
show_map();

});

function show_map() {

var retention_countries = Object.keys(retention_data.bachelor[institution_type]);
var europe_uni_filtered = structuredClone(europe_geo);

/* filtering the geometries of European countries in the `europe_uni_filtered` object based on whether
the country name is included in the `retention_countries` array. */
europe_uni_filtered.objects.europe.geometries = europe_uni_filtered.objects.europe.geometries.filter(geometry => {
    const countryName = geometry.properties.NAME;
    return retention_countries.includes(countryName);
});



var pict_width = 600;
var pict_height = 500;

var VSpec = {

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
      "name": "europe_uni",
      "values": europe_geo,
      "format": {
        "type": "topojson",
        "feature": "europe"
      },
    },
    {
      "name": "europe_uni_filtered",
      "values": europe_uni_filtered,
            "format": {
        "type": "topojson",
        "feature": "europe"
      },
    },


  ],

  "marks": [

         {
      "type": "shape",
      "from": {"data": "europe_uni"},
      "encode": {

        "update": {
            "stroke": {"value": "white"},
          "fill": {"value": "lightgray"},

        },

      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    },
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
            "signal": "{'Name': datum.properties.NAME}"
          },
           "fill": {"value": "darkblue"},

        }
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    },

  ]


      };
      vegaEmbed('#vis', VSpec);

}

var current_data =  { "name": "Germany", "values": retention_data.bachelor[institution_type].Germany};

console.log(current_data);

show_map();