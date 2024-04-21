import pandas as pd
import json
import argparse
from jsonschema.validators import validate

parser = argparse.ArgumentParser(description='retention_model1_json_converter')
parser.add_argument('-i', '--input_file_path', default="./data/Bachelor-Data-Retention-Graduation.xlsx")

args = parser.parse_args()

xls = pd.ExcelFile(args.input_file_path)
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

        json_data[country] = [{"year": i, "total": j, "male": k, "female": l, "category": index} for i, j, k, l in
                              zip(years, total, male, female)]

    return json_data


research_universities = generate_json(research_universities)
universities_applied_sciences = generate_json(universities_applied_sciences)
both_types = generate_json(both_types)

data = {"RU": research_universities,
        "UAS": universities_applied_sciences,
        "RU+UAS": both_types}

# performing a data validation step to ensure that all the countries present in the data extracted
# from the Excel file (stored in the `countries_retention` set) are also present in the geographic data
countries_retention = set(list(data["RU"].keys()) + list(data["UAS"].keys()) + list(data["RU+UAS"].keys()))
with open("./europe_geo_data.json", "r") as f:
    country_coordinates = json.load(f)
countries_mapped = set([i["properties"]["NAME"] for i in country_coordinates["objects"]["europe"]["geometries"]])
assert len(countries_retention - countries_mapped) == 0

with open("retention_schema.json", "r") as f:
    schema = json.load(f)

data = {"bachelor": data}

# Validate the data against the schema
try:
    validate(instance=data, schema=schema)
    print("Validation successful. The data conforms to the schema.")
except Exception as e:
    print("Validation failed. The data does not conform to the schema.")
    print(e)

with open('./static/js/retention_data.js', 'w', encoding='utf-8') as f:
    f.write("var retention_data = ")
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Data are saved to ./static/js/retention_data.js")
