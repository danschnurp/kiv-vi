

function show_ribbon(current_data, current_gender, institution_type_label) {



    var linevis = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "description": " ",
      "width": 1200,
      "height": 400,
    
    
      "title": {
        "text": "  Retention Rates in Informatics Studies across European Countries  ",
         "subtitle": institution_type_label + " over all years." ,
        "fontSize": 15,
        "subtitleFontSize": 13,
        "padding": 20
        },
    
    
      "data":    { "values": current_data["values"]},
    
      "encoding": {
        "x": {
          "field": "year",
          "type": "nominal",
          "axis": {
            "domain": false,
            "grid": true,
            "domainColor": "#dddddd",
            "ticks": true,
            "labels": true,
            "labelAngle": 0,
            "labelFontSize": 12,
            "labelPadding": 6
          },
          "title": null
        },
        "y": {
          "field": "total",  
          "type": "ordinal",
     
          "axis": {"domain": false, "grid": false, "ticks": false, "labels": false},
          "title": null
        },
        "opacity": {"value": 1},
        "color": {
          "title": null,
          "field": "country_name",
          "type": "nominal",
          "scale": {"range": [ "#4E79A7 ", "#F28E2B ", "#E15759 ", "#76B7B2 ", "#59A14F ", "#EDC948 ", "#B07AA1 ", "#FF9DA7 ", "#9C755F ", "#BAB0AC "]},
          "legend": {
            "padding": 0,
            "labelFontSize": 12,
            "title": "" + titleCase(current_gender) + " Rates",
            "rowPadding": 12,
            "symbolOpacity": 0.6,
            "symbolType": "square"
          }
        },
        "order": {"field": "total",   "type": "quantitative" },
        "tooltip": [
          {"field": "year", "type": "nominal", "title": "year"},
          {"field": "country_name", "type": "nominal", "title": "Type"},
          {"field": "total", "format": "0.1%",  "type": "quantitative", "title": "Value"}
        ]
      },
      "layer": [
        {
          "transform": [
            {
              "window": [{"op": "sum", "field": "total",   "as": "sumx"}],
              "groupby": ["year", "type"]
            }
          ],
          "params": [
            {"name": "click", "select": {"type": "point", "encodings": ["color"]}}
          ],
          "mark": {"type": "bar"},
          "encoding": {
            "opacity": {"value": 0},
            "y": {"field": "sumx", "type": "quantitative", "stack": "zero"},
            "x": {"field": "year", "type": "nominal"},
            "order": {
              "aggregate": "max",
              "field": "total",  
              "type": "quantitative"
            }
          }
        },
        {
          "transform": [
            {
              "window": [{"op": "sum", "field": "total",   "as": "sum"}],
              "groupby": ["year", "type"]
            }
          ],
          "mark": {"type": "area", "interpolate": "monotone"},
          "encoding": {
            "opacity": {
              "condition": {"param": "click", "value": 0.6},
              "value": 0.1
            },
            "y": {"field": "sum", "type": "quantitative", "stack": "center"},
            "x": {"field": "year", "type": "nominal"},
            "detail": {"field": "country_name", "type": "nominal"},
            "order": {
              "aggregate": "max",
              "field": "total",  
              "type": "quantitative"
            }
          }
        },
        {
    
           "transform": [
            {
              "window": [{"op": "sum", "field": "total",   "as": "sum"}],
              "groupby": ["year", "type"]
            }
          ],
    
          "mark": {"type": "text", "dy": 12, "dx": 0, "fontSize": 12},
          "encoding": {
            "x": {"field": "year", "type": "nominal"},
            "y": {"field": "sum",   "type": "quantitative", "stack": "center"},
            "text": {"field": "total", "format": "0.1%",  "type": "quantitative"},
            "color": {"value": "rgba(0,0,0,0.8)"},
            "opacity": {"condition": {"param": "click", "value": 1}, "value": 0.2}
          }
        },
    
    
      ]
    };
    
     vegaEmbed('#ribbonvis', linevis);
    
    
    
    
    
     }
    