
var institution_type = document.getElementById("institution_type").value;
var current_country = "Czech Republic";
var current_data =  { "name": current_country, "values": retention_data.bachelor[institution_type][current_country]};


/* event listener to the HTML element with the id "institution_type". */
document.getElementById("institution_type").addEventListener("change", function() {
institution_type = this.value;
console.log(institution_type);
show_map();
current_data =  { "name": current_country, "values": retention_data.bachelor[institution_type][current_country]};
console.log(current_data);
show_bar(current_data);
});

/* displaying an interactive map of Europe */
function show_map() {

var retention_countries = Object.keys(retention_data.bachelor[institution_type]);
var europe_uni_filtered = structuredClone(europe_geo);

/* filtering the geometries of European countries in the `europe_uni_filtered` object based on whether
the country name is included in the `retention_countries` array. */
europe_uni_filtered.objects.europe.geometries = europe_uni_filtered.objects.europe.geometries.filter(geometry => {
    const countryName = geometry.properties.NAME;
    return retention_countries.includes(countryName);
});


for (let i = 0; i < europe_uni_filtered.objects.europe.geometries.length; i++) {

var retention = retention_data.bachelor[institution_type][europe_uni_filtered.objects.europe.geometries[i].properties.NAME][0];

if (retention.total > 1.0 ) retention.total = 0.99;
if (retention.total === 0 ) retention.total = 0.5;
console.log(retention);
europe_uni_filtered.objects.europe.geometries[i].properties.DATA = retention;

}



console.log(europe_uni_filtered);

var pict_width = 600;
var pict_height = 500;

var VSpec = {

  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "An interactive map of Europe supporting pan and zoom.",
  "width": pict_width,
  "height": pict_height,

     "title": "Interactive map",

  "signals": [
    { "name": "tx", "update": "width / 2" },
    { "name": "ty", "update": "height / 2" },

    {
      "name": "scale",
      "value": 350,
      "on": [{
        "events": {"type": "wheel", "consume": true},
        /* controlling the scaling behavior of the interactive
        map in response to mouse wheel events (zooming in and out). */
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
      /*  initial value of 55 pointing to europe */
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
       /*  initial values pointing to europe */
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
          "cursor": {"value": "pointer"},
          "opacity": {"signal":  "datum.properties.DATA.total"}

        },
        "hover": {
          "tooltip": {
            "signal":
  "{'Name': datum.properties.NAME, 'year': datum.properties.DATA.year, 'male+female': datum.properties.DATA.total, 'male': datum.properties.DATA.male, 'female': datum.properties.DATA.female }"
          },
           "fill": {"value": "steelblue"},
        },
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    },

  ]


      };
      vegaEmbed('#vis', VSpec);

}





show_map();