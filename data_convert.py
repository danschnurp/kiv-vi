import pandas as pd
import json
from jsonschema import validate

schema = json.load(open("data_schema.json"))

xls = pd.ExcelFile("./data/Bachelor-Data-Retention-Graduation.xlsx")

df1 = pd.read_excel(xls, "Legend")
df = pd.read_excel(xls, "Retention-Rate model1", skiprows=2)

sample = {
    "RU": {
        "countries": [
            {
                "name": "CZ",
                "years": [
                    {"year": 10, "total": 1000, "male": 520.5, "female": 479.5},
                    {"year": 10, "total": 1200, "male": 612, "female": 588}
                ]
            },
            {
                "name": "NECO",
                "years": [
                    {"year": 10, "total": 250, "male": 128, "female": 122},
                    {"year": 10, "total": 280, "male": 145, "female": 135}
                ]
            }
        ]
    },
    "UAS": {
        "countries": [
            {
                "name": "CZ",
                "years": [
                    {"year": 10, "total": 800, "male": 408, "female": 392},
                    {"year": 10, "total": 900, "male": 472, "female": 428}
                ]
            }
        ]
    },
    "": {
        "countries": [
            {
                "name": "CZ",
                "years": [
                    {"year": 10, "total": 1800, "male": 928.5, "female": 871.5},
                    {"year": 10, "total": 2100, "male": 1084, "female": 1016}
                ]
            }
        ]
    }
}

validate(instance=sample, schema=schema)

print(sample)
