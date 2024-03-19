import pandas as pd
import json

import geopandas as gpd

from jsonschema.validators import validate

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

        years = list(row[2::3].to_dict().keys())
        total = list(row[2::3].astype(str).replace(to_replace=["nan"], value="0").astype(float).to_dict().values())
        female = list(row[3::3].astype(str).replace(to_replace=["nan"], value="0").astype(float).to_dict().values())
        male = list(row[4::3].astype(str).replace(to_replace=["nan"], value="0").astype(float).to_dict().values())

        if country not in json_data:
            json_data[country] = {"years": years, "total": total, "female": female, "male": male}
        else:
            raise AttributeError("Duplicated country...")

    return json_data


research_universities = generate_json(research_universities)
universities_applied_sciences = generate_json(universities_applied_sciences)
both_types = generate_json(both_types)

data = {"retention": {"batchelor": {"RU": research_universities,
                                    "UAS": universities_applied_sciences,
                                    "RU + UAS": both_types}}}

with open('./data/data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

countries = set(list(both_types.keys()) +
                list(universities_applied_sciences.keys()) +
                list(research_universities.keys()))

countries = list(countries)

print(countries)


schema = json.load(open("data_schema.json"))
validate(instance=data, schema=schema)
