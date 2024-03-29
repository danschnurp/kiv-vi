import altair as alt


def generate_js(chart: alt.vegalite.v5.api.Chart):
    html_chart = chart.to_html()
    # These offsets will be the same for any chart
    start = html_chart.index('vegaEmbed') - 10
    end = html_chart.index('vegaEmbed);') + 11

    with open("./static/js/generated_map.js", "w") as f:
        f.write(html_chart[start:end])
