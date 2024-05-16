# Mapping Retention Rates in Informatics Studies across European Countries

It features an interactive map displaying retention rates, allowing users to explore data by hovering over each country. Additionally, there are two dynamic charts providing further insights into retention trends. Overall, the visualization offers a comprehensive view of informatics study retention across Europe, facilitating easy comparison and analysis.


### The statistics, how they are computed?

1. model: Retention rate = ratio between the actual and estimated number of Bachelor's students enrolled [in year X+1]. The latter (i.e. estimated) number of Bachelor's students is equal to the total number of Bachelor's students enrolled in all years [for year X] - number of Bachelor's degrees awarded [in year X] + number of first-year Bachelor's students enrolled [in year X+1].


2. model: Year-on-year retention rate, i.e. students still studying in Y+1 from those studying in Y corresponding years  --  upper bound, because number of 3rd year students in Y-1 is under-approximated by number of degrees awarded which is a subset of those 3rd year students


### How to convert data from excel (optional)
If you want to use similar data to use this visualization. Try to edit `retention_model1_json_convert.py`


- install dependencies
```
pip install -r requirements.txt
```
- run the modified script
```

python retention_model1_json_convert.py --model 2 -i  "./data/Bachelor-Data-Retention-Graduation.xlsx"
```

data for visualization should match `./retention_schema.json` file.