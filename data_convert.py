import pandas as pd
import json

import geopandas as gpd

from jsonschema.validators import validate

from io_utils import save_to_manual_vis
from vega_lite_generator import generate_js

xls = pd.ExcelFile("./data/Bachelor-Data-Retention-Graduation.xlsx")
df = pd.read_excel(xls, "Retention-Rate model1", skiprows=1)

# filtering the Data based on the values in the "Institution Type" column
research_universities = df[df["Institution Type"] == "(RU)"]
universities_applied_sciences = df[df["Institution Type"] == "(UAS)"]
both_types = df[df["Institution Type"] == "(RU + UAS)"]


def generate_json(dataframe):
    """
    processes a DataFrame to generate a JSON data structure containing information about
    countries, years, total values, female values, and male values.
    """
    json_data = {}
    for index, row in dataframe.iterrows():
        #  extracting the country name from the 'COUNTRY' column
        country = row['COUNTRY'][row['COUNTRY'].find(") ") + 2:]

        if country == 'Czech Republic ':
            country = 'Czech Republic'
        elif country == 'UK':
            country = 'United Kingdom'

        years = list(row[2::3].to_dict().keys())
        total = list(row[2::3].astype(str).replace(to_replace=["nan"], value="0").astype(float).to_dict().values())
        female = list(row[3::3].astype(str).replace(to_replace=["nan"], value="0").astype(float).to_dict().values())
        male = list(row[4::3].astype(str).replace(to_replace=["nan"], value="0").astype(float).to_dict().values())

        json_data[country] = [{"year": i, "total": j, "male": k, "female": l} for i, j, k, l in
                              zip(years, total, male, female) if j > 0 and k > 0 and l > 0]

    return json_data


research_universities = generate_json(research_universities)
universities_applied_sciences = generate_json(universities_applied_sciences)
both_types = generate_json(both_types)

data = {"RU": research_universities,
        "UAS": universities_applied_sciences,
        "RU+UAS": both_types}

countries_retention = set(list(data["RU"].keys()) + list(data["UAS"].keys()) + list(data["RU+UAS"].keys()))

with open("./europe_geo_data.json", "r") as f:
    country_coordinates = json.load(f)

countries_mapped = set([i["properties"]["NAME"] for i in country_coordinates["objects"]["europe"]["geometries"]])

assert len(countries_retention - countries_mapped) == 0

data = {"bachelor": data}


save_to_manual_vis(data)
#
# import altair as alt
#
# pict_width = 600
# pict_height = 500
#
# gdf_ne = gpd.read_file("./europe_geo_data.json", driver='TopoJSON')
#
#
# europe_map: alt.vegalite.v5.api.Chart = alt.Chart(gdf_ne).mark_geoshape(
#     fill='lightblue',
#     stroke='white'
# ).interactive()
#
#
#
#
# generate_js(europe_map)

