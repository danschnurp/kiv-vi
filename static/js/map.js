

// default values on init
var institution_type = document.getElementById("institution_type").value;
var institution_type_label = "Research Universities";
var current_countries = ["Czech Republic"];

var current_data =  { "name": "Czech Republic", "values": structuredClone(retention_data).bachelor[institution_type]["Czech Republic"]};;
var filtered_data = { "name": "Czech Republic", "values": structuredClone(retention_data).bachelor[institution_type]["Czech Republic"]};
var current_gender = "female";
var current_year = 0;
var current_year_label = 0;

var pict_width = 600;
var pict_height = 500;

document.getElementById("yearsRange").max = structuredClone(retention_data).bachelor[institution_type]["Czech Republic"].length - 1;

function titleCase(string){
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}


/**
 * The function `filter_non_outlier_data` filters data based on a specified gender value range and
 * returns the filtered country names and values.
 * @param gender - The function `filter_non_outlier_data` takes a gender parameter to filter data based
 * on the specified gender. It loops through the `current_countries` array and filters the data for a
 * bar chart based on the gender values falling between 0 and 1. If the filtered data has any items,
 * @returns The function `filter_non_outlier_data` is returning an object with the following
 * properties:
 * - "name": "countrydata"
 * - "country_names": an array containing the names of countries that meet the filtering criteria
 * - "values": an array containing the data values that meet the filtering criteria
 */
function filter_non_outlier_data(gender) {

  var data_values_filtered = [];
  var data_names_filtered = [];

  for (let i in current_countries) {

      // filtered for barchart
      var temp_data = [];
      retention_data.bachelor[institution_type][current_countries[i]].forEach(item => temp_data.push(item));

      temp_data = structuredClone(retention_data.bachelor[institution_type][current_countries[i]]).filter(item => {
                                                          return item[gender] > 0 && item[gender] < 1
                                                      });
      if (temp_data.length > 0) {
          temp_data.forEach(item => data_values_filtered.push(item));
          data_names_filtered.push(current_countries[i]);
          }
  }
 return structuredClone({ "name": "countrydata",
  "country_names": data_names_filtered,
    "values": data_values_filtered
    });

}

/**
 * The function `update_data` retrieves and processes data for a specific country, institution type, and gender,
 * calculating the minimum and maximum values.
 */
function update_data() {

        var data_values = [];
        var data_names = [];


        for (let i in current_countries) {
            // non-filtered for linechart
            retention_data.bachelor[institution_type][current_countries[i]].forEach(item => data_values.push(item));
            data_names.push( structuredClone(current_countries[i]));

         }

       filtered_data = filter_non_outlier_data(current_gender);

       current_data =  { "name": "countrydata",
        "country_names":  structuredClone(data_names),
          "values": structuredClone(data_values)
          };



    }



  function prepare_data_genders() {
    if (document.getElementById("gender").value !== "male_vs_female") return null;
    // console.log("prepraring data for male vs female comparision");

    var female_data_filtered = filter_non_outlier_data("female");
    var male_data_filtered = filter_non_outlier_data("male");
    female_data_filtered["country_names"].concat(male_data_filtered["country_names"]);
    female_data_filtered["values"].concat(male_data_filtered["values"]);
      return female_data_filtered;


  }


/**
 *  redraw_charts filters and processes data before displaying it on a map and a bar chart.
 * @param current_data - The `current_data` parameter is an object that contains the name of the current country and an
 * array of values related to bachelor retention data for that country and institution type. The function filters out
 * values based on a specific gender range and then calculates the minimum value from the filtered data to adjust the view.
 */
function redraw_charts(current_data) {

  
  var data_genders = prepare_data_genders();

  if (data_genders != null) {

    show_line_genders(current_data, current_gender, institution_type_label);
    show_bar_genders(data_genders, current_gender, institution_type_label);

  }
  else {
    show_line(current_data, current_gender, institution_type_label);
    // show_ribbon(structuredClone(current_data), current_gender, institution_type_label);
    show_bar(structuredClone(filtered_data), current_gender, institution_type_label);
  }

};

/* choosing the country for charts */
document.getElementById("vis").addEventListener("dblclick", function(e) {


        var selected_country = document.getElementById("vg-tooltip-element").getElementsByClassName("value");
        selected_country = selected_country[0].innerHTML;
//        if (e.shiftKey)

          var duplicity = current_countries.filter((item) => item === selected_country);
          current_countries = new Set(current_countries);
          if (duplicity.length > 0)  current_countries.delete(duplicity[0]);
          else  if (Array.from(current_countries).length < 7)  current_countries.add(selected_country);

                

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
    if (this.value === "male_vs_female") {
      current_gender = "total";
    }
    else {
    current_gender = this.value;
    }
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

    var retention_countries = Object.keys(structuredClone(retention_data.bachelor[institution_type]));
    var europe_uni_filtered = structuredClone(europe_geo);



    var    data_min = 2;
var        data_max = -1;

    for (let i in retention_countries) {
       var data = retention_data.bachelor[institution_type][retention_countries[i]];
           if (data.length > 0) {
               data = data.filter(item => {
                                     return item[current_gender] > 0 && item[current_gender] < 1
                                                                    });

                var local_min = Math.min(...data.map(item => item[current_gender]));
                var local_max = Math.max(...data.map(item => item[current_gender]));
                if (local_max > data_max) data_max = local_max;
                if (local_min < data_min) data_min = local_min;
        }
    }


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


    var delta = 0.2;

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
      "domain": [0, data_min, (data_min + data_max) / 2 , data_max, 1.01],
      "range": [ "rgba(50, 50, 50, 0.5)", "rgba(70,130,180, 0.35)", "rgba(70,130,180, 0.7)", "rgba(70,130,180, 0.95)",  "rgb(170, 57, 57, 0.5)"]
    },

    {
      "name": "main_description",
      "type": "ordinal",
      "nice": true,
      "domain": [],
      "range": [ ]
    }
  ],

    "legends": [

    {

 "fillColor": "rgba(255,255,255,0.5)",
      "fill": "color",
      "orient": "bottom-right",
      "title": titleCase(current_gender) + " Rates",
      "format": "0.1%"
    },
    {
      "title": "0% missing data, 101% is outlier", 
      "fill": "main_description",
      "orient": "bottom-left",
  
  }

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
                                    // is value > 1 ?
          "fill": {"signal": "1.0 < datum.properties.DATA." + current_gender + "  ? "+
               //   red                         is value zero ?
          " 'rgb(206, 145, 145)' : 0 === datum.properties.DATA." + current_gender + " ? "+
          //   gray
          " 'rgb(150, 150, 150)': 'steelblue'"},
          "cursor": {"value": "pointer"},
                                         // is value in 0,1 interval?
          "opacity": {"signal": "1.0 >  ( datum.properties.DATA." + current_gender + " - " + data_min + " ) / " + ( 1 - data_min) + "+"  + delta +
          " &&  ( datum.properties.DATA." + current_gender + " - " + data_min + " ) / " + ( 1 - data_min) + "+"  + delta + "  > 0.0 ? "+

          " ( datum.properties.DATA." + current_gender + " - " + data_min + " ) / " + ( 1 - data_min) + "+"  + delta + " :  1" }
        },
        "hover": {
          "tooltip": {
            "signal":
  "{'Name': datum.properties.NAME, 'year': datum.properties.DATA.year,  'total': datum.properties.DATA.total, 'male': datum.properties.DATA.male, 'female': datum.properties.DATA.female }"
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