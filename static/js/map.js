

// default values on init
var institution_type = document.getElementById("institution_type").value;
var institution_type_label = "Research Universities";
var current_country = "Czech Republic";
var current_country2 = "Germany";
var current_country3 = "United Kingdom";
var current_country4 = "Portugal";
var current_data =  { "name": current_country, "values": retention_data.bachelor[institution_type][current_country]};
var current_gender = "total";
var current_year = 0;
var current_year_label = 0;
var data_std = 0;
var data_mean = 0;
var data_min = Math.min(...current_data.values.map(item => item[current_gender])) - 0.001;
var data_max = Math.max(...current_data.values.map(item => item[current_gender]));
document.getElementById("yearsRange").max = retention_data.bachelor[institution_type][current_country].length - 1;

function titleCase(string){
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * The function `update_data` retrieves and processes data for a specific country, institution type, and gender,
 * calculating the minimum and maximum values.
 */
function update_data() {
    try {
        console.log(document.getElementById("current_data").innerHTML);
        document.getElementById("country").innerHTML = "1. " + current_country;
        document.getElementById("country2").innerHTML =  "2. " + current_country2;

        document.getElementById("country3").innerHTML =  "3. " + current_country3;

        document.getElementById("country4").innerHTML =  "4. " + current_country4;

//        todo checking the data for emptiness if there is the france at 1. there is a info mismatch

        current_data =  { "name": current_country, "country_names": [current_country, current_country2,current_country3,current_country4 ],
          "values": retention_data.bachelor[institution_type][current_country]
          .concat(retention_data.bachelor[institution_type][current_country2])
          .concat(retention_data.bachelor[institution_type][current_country3])
          .concat(retention_data.bachelor[institution_type][current_country4])};

        /*  calculating the minimum value and adds magic delta to view min value */
        data_min = Math.min(...current_data.values.map(item => item[current_gender])) + 0.09;
        data_max = Math.max(...current_data.values.map(item => item[current_gender]));
    }
    catch(err) {
        current_data = { "name": current_country, "values": {}};
        data_min = 0;
        data_max = 1;
    }
}

/**
 *  redraw_charts filters and processes data before displaying it on a map and a bar chart.
 * @param current_data - The `current_data` parameter is an object that contains the name of the current country and an
 * array of values related to bachelor retention data for that country and institution type. The function filters out
 * values based on a specific gender range and then calculates the minimum value from the filtered data to adjust the view.
 */
function redraw_charts(current_data) {

    show_line(structuredClone(current_data), current_gender, institution_type_label);

    show_bar(structuredClone(current_data), current_gender, institution_type_label);


};

/* choosing the country for charts */
document.getElementById("vis").addEventListener("dblclick", function() {
console.log(document.querySelector('input[name="country_order"]:checked').value)
    switch (document.querySelector('input[name="country_order"]:checked').value) {
    case "current_data":
        current_country = document.getElementById("vg-tooltip-element").getElementsByClassName("value");
        current_country = current_country[0].innerHTML;

        break;
    case "current_data2":
        current_country2 = document.getElementById("vg-tooltip-element").getElementsByClassName("value");
        current_country2 = current_country2[0].innerHTML;

        break;
    case "current_data3":
        current_country3 = document.getElementById("vg-tooltip-element").getElementsByClassName("value");
        current_country3 = current_country3[0].innerHTML;

        break;
    case "current_data4":
        current_country4 = document.getElementById("vg-tooltip-element").getElementsByClassName("value");
        current_country4 = current_country4[0].innerHTML;
        break;
    }

        update_data();
        redraw_charts(current_data);

});


/* event listener to the HTML element with the id "gender". */
document.getElementById("gender").addEventListener("change", function() {
    current_gender = this.value;
    update_data();
    redraw_charts(current_data);
    show_map(current_data);
});

/* event listener to the HTML element with the id "yearsRange". */
document.getElementById("yearsRange").addEventListener("change", function() {
    current_year = this.value;
    update_data();
    redraw_charts(current_data);
    show_map(current_data);
});


/* event listener to the HTML element with the id "institution_type". */
document.getElementById("institution_type").addEventListener("change", function() {
    institution_type = this.value;
    if (institution_type === "RU") institution_type_label = "Research Universities";
    else if (institution_type === "UAS") institution_type_label = "Universities of Applied Sciences";
    else if (institution_type === "RU+UAS") institution_type_label = "Both institution types";
    update_data();
    redraw_charts(current_data);
    show_map(current_data);
});





/* displaying an interactive map of Europe */
function show_map(current_data) {

    update_data();
    var retention_countries = Object.keys(retention_data.bachelor[institution_type]);
    var europe_uni_filtered = structuredClone(europe_geo);

    /* filtering the geometries of European countries in the `europe_uni_filtered` object based on whether
    the country name is included in the `retention_countries` array. */
    europe_uni_filtered.objects.europe.geometries = europe_uni_filtered.objects.europe.geometries.filter(geometry => {
        const countryName = geometry.properties.NAME;
        return retention_countries.includes(countryName);
    });

    var europe_uni_not_participated = structuredClone(europe_geo);

    /* filtering the geometries of European countries in the `europe_uni_not_participated` object based on whether
    the country name is included in the `retention_countries` array. */
    europe_uni_not_participated.objects.europe.geometries = europe_uni_not_participated.objects.europe.geometries.filter(geometry => {
        const countryName = geometry.properties.NAME;
        return !retention_countries.includes(countryName);
    });


    for (let i = 0; i < europe_uni_filtered.objects.europe.geometries.length; i++) {
        /* retrieving the retention data for a specific country and institution type from the `retention_data` object based on the
        country name obtained from the `europe_uni_filtered` object. */
        var retention = retention_data.bachelor[institution_type][europe_uni_filtered.objects.europe.geometries[i].properties.NAME][current_year];
        current_year_label = retention_data.bachelor[institution_type][europe_uni_filtered.objects.europe.geometries[i].properties.NAME][current_year]["year"]

        europe_uni_filtered.objects.europe.geometries[i].properties.DATA = retention;
    }

    // updating the current year label on slider
//    document.getElementById("yearsRangeLabel").innerHTML = " &nbsp &nbsp " + current_year_label;
    document.getElementById("start_years_range").innerHTML = retention_data.bachelor[institution_type][europe_uni_filtered.objects.europe.geometries[0].properties.NAME][0]["year"];
    document.getElementById("end_years_range").innerHTML = retention_data.bachelor[institution_type][europe_uni_filtered.objects.europe.geometries[0].properties.NAME][retention_data.bachelor[institution_type][europe_uni_filtered.objects.europe.geometries[0].properties.NAME].length - 1]["year"];

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
     "subtitle":"  Retention Rates in Informatics Studies across European Countries  ",
      "text":  institution_type_label + " in " + current_year_label,
     "fontSize": 20,
     "subtitleFontSize": 15,
     "dy": 1,
     },

  "scales": [
    {
      "name": "color",
      "type": "ordinal",
      "nice": true,
      "domain": [0, 0.5, 0.7, 0.99, 1.01],
      "range": [ "rgba(50, 50, 50, 0.5)", "rgba(70,130,180, 0.5)", "rgba(70,130,180, 0.7)", "rgba(70,130,180, 0.99)",  "rgb(170, 57, 57, 0.5)"]
    }
  ],

    "legends": [

    {

 "fillColor": "rgba(255,255,255,0.5)",
      "fill": "color",
      "orient": "bottom-right",
      "title": current_gender + " rates",
      "format": "0.1%"
    },

  ],


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
      "name": "rotateX", "value": -6,
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
      "values": europe_uni_not_participated,
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
          "fill": {"signal": "1.0 < datum.properties.DATA." + current_gender + "  ? 'rgb(170, 57, 57)' : 0 === datum.properties.DATA." + current_gender + " ? 'rgb(50, 50, 50)': 'steelblue'"},
          "cursor": {"value": "pointer"},
          "opacity": {"signal": "1.0 > datum.properties.DATA." + current_gender + " && datum.properties.DATA." + current_gender + " > 0.0 ? ( datum.properties.DATA." + current_gender + " - " + data_min + " ) / " + ( 1 - data_min) + ":  0.5" }
        },
        "hover": {
          "tooltip": {
            "signal":
  "{'Name': datum.properties.NAME, 'year': datum.properties.DATA.year, 'scaled':( datum.properties.DATA." +
  current_gender + " - " + data_min + " ) / " + ( 1 - data_min) + "  , 'male+female': datum.properties.DATA.total, 'male': datum.properties.DATA.male, 'female': datum.properties.DATA.female }"
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

// initialization call
update_data();
redraw_charts(current_data);
show_map(current_data);