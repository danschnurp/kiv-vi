

// default values on init
var institution_type = document.getElementById("institution_type").value;
var institution_type_label = "Research Universities";
var current_countries = ["Czech Republic"];

var current_data =  { "name": "Czech Republic", "values": structuredClone(retention_data).bachelor[institution_type]["Czech Republic"]};;
var filtered_data = { "name": "Czech Republic", "values": structuredClone(retention_data).bachelor[institution_type]["Czech Republic"]};
var current_gender = "female";
var current_year = 0;
var current_year_label = 0;

document.getElementById("yearsRange").max = structuredClone(retention_data).bachelor[institution_type]["Czech Republic"].length - 1;

function titleCase(string){
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * The function `update_data` retrieves and processes data for a specific country, institution type, and gender,
 * calculating the minimum and maximum values.
 */
function update_data() {

        var data_values = [];
        var data_values_filtered = [];
        var data_names = [];
        var data_names_filtered = [];


        for (let i in current_countries) {
            // non-filtered for linechart
            retention_data.bachelor[institution_type][current_countries[i]].forEach(item => data_values.push(item));
            data_names.push( structuredClone(current_countries[i]));

            // filtered for barchart
            var temp_data = [];
            retention_data.bachelor[institution_type][current_countries[i]].forEach(item => temp_data.push(item));

            temp_data = structuredClone(retention_data.bachelor[institution_type][current_countries[i]]).filter(item => {
                                                                return item[current_gender] > 0 && item[current_gender] < 1
                                                            });



            if (temp_data.length > 0) {
                temp_data.forEach(item => data_values_filtered.push(item));
                data_names_filtered.push(current_countries[i]);
                }
        }

       filtered_data = { "name": "countrydata",
        "country_names": data_names_filtered,
          "values": data_values_filtered
          };

       current_data =  { "name": "countrydata",
        "country_names":  structuredClone(data_names),
          "values": structuredClone(data_values)
          };



    }


/**
 *  redraw_charts filters and processes data before displaying it on a map and a bar chart.
 * @param current_data - The `current_data` parameter is an object that contains the name of the current country and an
 * array of values related to bachelor retention data for that country and institution type. The function filters out
 * values based on a specific gender range and then calculates the minimum value from the filtered data to adjust the view.
 */
function redraw_charts(current_data) {

    show_line(structuredClone(current_data), current_gender, institution_type_label);

    show_bar(structuredClone(filtered_data), current_gender, institution_type_label);


};

/* choosing the country for charts */
document.getElementById("vis").addEventListener("dblclick", function(e) {


        var selected_country = document.getElementById("vg-tooltip-element").getElementsByClassName("value");
        selected_country = selected_country[0].innerHTML;
//        if (e.shiftKey)

        current_countries = new Set(current_countries);
        current_countries.add(selected_country);
        current_countries = Array.from(current_countries);


        update_data();
        redraw_charts(current_data);

});

document.getElementById("selected_countries").addEventListener("click", function(e) {
 current_countries = []
         update_data();
        redraw_charts(current_data);
});


/* event listener to the HTML element with the id "gender". */
document.getElementById("gender").addEventListener("change", function() {
current_countries = ["Czech Republic"];
    current_gender = this.value;
    update_data();
    redraw_charts(current_data);
    show_map(current_data);
});

/* event listener to the HTML element with the id "yearsRange". */
document.getElementById("yearsRange").addEventListener("change", function() {
current_countries = ["Czech Republic"];
    current_year = this.value;
    update_data();
    redraw_charts(current_data);
    show_map(current_data);
});


/* event listener to the HTML element with the id "institution_type". */
document.getElementById("institution_type").addEventListener("change", function() {
current_countries = ["Czech Republic"];
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
    var retention_countries = Object.keys(structuredClone(retention_data.bachelor[institution_type]));
    var europe_uni_filtered = structuredClone(europe_geo);



    var    data_min = 2;
var        data_max = -1;

    for (let i in current_countries) {
       var data = retention_data.bachelor[institution_type][current_countries[i]];
       data = data.filter(item => {
                                                            return item[current_gender] > 0 && item[current_gender] < 1
                                                            });

    var local_min = Math.min(...data.map(item => item[current_gender]));
        var local_max = Math.max(...data.map(item => item[current_gender]));
        if (local_max > data_max) data_max = local_max;
        if (local_min < data_min) data_min = local_min;

    }

    data_min -= 0.1

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
      "domain": [0, data_min +0.1, data_min+ 0.2, 0.99, 1.01],
      "range": [ "rgba(50, 50, 50, 0.5)", "rgba(70,130,180, 0.35)", "rgba(70,130,180, 0.7)", "rgba(70,130,180, 0.99)",  "rgb(170, 57, 57, 0.5)"]
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