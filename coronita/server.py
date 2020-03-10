from flask import Flask, escape, request, render_template, url_for
import pandas as pd
from pathlib import Path
import json
import numpy as np
from datetime import datetime, date
from coronita import analysis
from coronita.analysis import get_ttl_hash


CURR_DIR = Path(__file__).resolve().parent

app = Flask(__name__,
            static_folder=str(CURR_DIR / 'static'),)


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


@app.route('/tamponi_infected_ratio')
def tamponi_infected_ratio():
    return json.dumps(analysis.tamponi_infected_ratio(ttl_hash=get_ttl_hash()).to_dict(orient='records'), default=json_serial)


@app.route('/cases_hist')
def cases_hist():
    normalized = request.args.get('normalized', default='', type=str)
    return json.dumps(analysis.total_case_histogram(normalized, ttl_hash=get_ttl_hash()).to_dict(orient='records'))


@app.route('/total_time_serie')
def total_time_serie():
    data = analysis.total_case_time_series(
        ttl_hash=get_ttl_hash()).to_dict(orient='records')
    total_time_series = analysis.total_case_time_series(
        ttl_hash=get_ttl_hash())
    ((a, b), fitted_y) = analysis.fit_exponential(ttl_hash=get_ttl_hash())
    for raw_point, fitted_point_y in zip(data, fitted_y):
        raw_point['fitted'] = fitted_point_y

    return json.dumps({
        'data': data,
        'coeffs': [a, b]
    }, default=json_serial)


@app.route('/dead_proportion')
def dead_proportion():
    region = request.args.get('region', default='All', type=str)
    return json.dumps(analysis.dead_proportion(region, ttl_hash=get_ttl_hash()).to_dict(orient='records'), default=json_serial)


@app.route('/stacked_area')
def funnel():
    region = request.args.get('region', default='All', type=str)
    return json.dumps(analysis.stacked_area_data(region, ttl_hash=get_ttl_hash()).to_dict(orient='records'), default=json_serial)


@app.route('/growth_rate')
def growth_rate():
    total_time_series = analysis.total_case_time_series(
        ttl_hash=get_ttl_hash())
    y = total_time_series['totale_casi'].values
    growth_r = analysis.growth_rate(y[1:])
    growth_r = [{'day': d, 'gr': gr} for (d, gr) in zip(
        total_time_series['day'].values[2:], growth_r)]
    return json.dumps(growth_r, default=json_serial)


@app.route('/province_cases_hist')
def province_cases_hist():
    normalized = request.args.get('normalized', default='', type=str)
    region = request.args.get('region', default='Veneto', type=str)
    return json.dumps(analysis.region_histogram(region, normalized, ttl_hash=get_ttl_hash()).to_dict(orient='records'), default=json_serial)


@app.route('/')
def hello():
    name = request.args.get("name", "World")

    return render_template('base.html', regions=analysis.region_list(ttl_hash=get_ttl_hash()))
