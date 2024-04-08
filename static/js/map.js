
var institution_type = document.getElementById("institution_type").value;
var institution_type_label = "Research Universities";
var current_country = "Czech Republic";
var current_data =  { "name": current_country, "values": retention_data.bachelor[institution_type][current_country]};
var current_gender = "total";
var current_year = 0;
var current_year_label = 0;
var data_std = 0;
var data_mean = 0;
var data_min = Math.min(...current_data.values.map(item => item[current_gender])) - 0.001;

function normalize_data() {

var data = retention_data.bachelor[institution_type];

var sum = 0;
for( var i = 0; i < data.length; i++ ){
    sum +=  data[i];
}

data_mean = sum / current_data.values.length;

console.log(current_data.values.length)



};

function check_outliers() {

 for (let i = 0; i < current_data.values.length; i++) {
 console.log(current_data.values[i][current_gender]);
if (current_data.values[i][current_gender] > 1){
current_data =  { "name": current_country + " (outliers)", "values": retention_data.bachelor[institution_type][current_country]};

return true;
}
}
return false

}

/**
 *  redraws filters and processes data before displaying it on a map and a bar chart.
 * @param current_data - The `current_data` parameter is an object that contains the name of the current country and an
 * array of values related to bachelor retention data for that country and institution type. The function filters out
 * values based on a specific gender range and then calculates the minimum value from the filtered data to adjust the view.
 */
function redraw(current_data) {
document.getElementById("yearsRange").max = retention_data.bachelor[institution_type][current_country].length - 1
current_data =  { "name": current_country, "values": retention_data.bachelor[institution_type][current_country]};
current_data.values = current_data.values.filter(item => {
return item[current_gender] > 0 && item[current_gender] < 1
});

if (current_data.values.length == 0)
current_data =  { "name": current_country + " (outliers)", "values": retention_data.bachelor[institution_type][current_country]};


/*  calculating the minimum value and adds magic 0,07 delta to view min value */
data_min = Math.min(...current_data.values.map(item => item[current_gender])) - 0.07;
show_map();

show_line(current_data);
show_bar(current_data);

};

document.getElementById("vis").addEventListener("dblclick", function() {
current_country = document.getElementById("vg-tooltip-element").getElementsByClassName("value");
current_country = current_country[0].innerHTML
redraw(current_data);
});


/* event listener to the HTML element with the id "gender". */
document.getElementById("gender").addEventListener("change", function() {
current_gender = this.value;
redraw(current_data);
});

/* event listener to the HTML element with the id "yearsRange". */
document.getElementById("yearsRange").addEventListener("change", function() {
current_year = this.value;
redraw(current_data);
});


/* event listener to the HTML element with the id "institution_type". */
document.getElementById("institution_type").addEventListener("change", function() {
institution_type = this.value;
if (institution_type === "RU") institution_type_label = "Research Universities";
else if (institution_type === "UAS") institution_type_label = "Universities of Applied Sciences";
else if (institution_type === "RU+UAS") institution_type_label = "Both institution types";

redraw(current_data);
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
        /* retrieving the retention data for a specific country and institution type from the `retention_data` object based on the
        country name obtained from the `europe_uni_filtered` object. */
        var retention = retention_data.bachelor[institution_type][europe_uni_filtered.objects.europe.geometries[i].properties.NAME][current_year];
        current_year_label = retention_data.bachelor[institution_type][europe_uni_filtered.objects.europe.geometries[i].properties.NAME][current_year]["year"]
      if (retention[current_gender] > 1.0 ) retention[current_gender] = 1;


        europe_uni_filtered.objects.europe.geometries[i].properties.DATA = retention;
    }



    var pict_width = 600;
    var pict_height = 500;

    var VSpec = {

  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "An interactive map of Europe supporting pan and zoom.",
  "width": pict_width,
  "height": pict_height,
    "autosize": {"type": "pad", "resize": true},
    "background": "white",


     "title": {
     "subtitle":"  Retention Rates in Informatics Studies in European Countries  ",
      "text":  institution_type_label +  " " + current_gender + " in " + current_year_label,
     "fontSize": 20,
     "subtitleFontSize": 15,
     "dy": 10,
     },

//     todo legend of retention intensity

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
          "fill": {"value": "steelblue"},
          "cursor": {"value": "pointer"},
          "opacity": {"signal":  "( datum.properties.DATA." + current_gender + " - " + data_min + " ) / " + ( 1 - data_min) + " " }
        },
        "hover": {
          "tooltip": {
            "signal":
  "{'Name': datum.properties.NAME, 'year': datum.properties.DATA.year, 'scaled':( datum.properties.DATA." + current_gender + " - " + data_min + " ) / " + ( 1 - data_min) + "  , 'male+female': datum.properties.DATA.total, 'male': datum.properties.DATA.male, 'female': datum.properties.DATA.female }"
          },
           "fill": {"value": "lightblue"},
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


redraw(current_data);