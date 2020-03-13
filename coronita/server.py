import json
from datetime import date, datetime
from pathlib import Path

import numpy as np
import pandas as pd

from coronita import analysis
from coronita.analysis import get_ttl_hash
from flask import Flask, escape, render_template, request, url_for

CURR_DIR = Path(__file__).resolve().parent

app = Flask(
    __name__,
    static_folder=str(CURR_DIR / 'static'),
)


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


@app.route('/tamponi_infected_ratio')
def tamponi_infected_ratio():
    region = request.args.get('region', default='All', type=str)
    return json.dumps(analysis.tamponi_infected_ratio(region,
        ttl_hash=get_ttl_hash()).to_dict(orient='records'),
                      default=json_serial)


@app.route('/cases_hist')
def cases_hist():
    normalized = request.args.get('normalized', default='', type=str)
    date = request.args.get('date', default=analysis.day_list( ttl_hash=get_ttl_hash())[-1], type=str)
    return json.dumps(
        analysis.total_case_histogram(date,
            normalized, ttl_hash=get_ttl_hash()).to_dict(orient='records'))


@app.route('/map')
def map():
    return analysis.map_str()


@app.route('/map_markers')
def map_markers():
    date = request.args.get('date', default='2020-03-11', type=str)
    return json.dumps(
        analysis.map_locations(date, ttl_hash=get_ttl_hash()).to_dict(
            orient='records'))


@app.route('/total_time_serie')
def total_time_serie():
    data = analysis.total_case_time_series(ttl_hash=get_ttl_hash()).to_dict(
        orient='records')
    total_time_series = analysis.total_case_time_series(
        ttl_hash=get_ttl_hash())
    ((a, b), fitted_y) = analysis.fit_exponential(ttl_hash=get_ttl_hash())
    for raw_point, fitted_point_y in zip(data, fitted_y):
        raw_point['fitted'] = fitted_point_y

    return json.dumps({'data': data, 'coeffs': [a, b]}, default=json_serial)


@app.route('/dead_proportion')
def dead_proportion():
    region = request.args.get('region', default='All', type=str)
    return json.dumps(analysis.dead_proportion(
        region, ttl_hash=get_ttl_hash()).to_dict(orient='records'),
                      default=json_serial)


@app.route('/stacked_area')
def stacked_area():
    region = request.args.get('region', default='All', type=str)
    return json.dumps(analysis.stacked_area_data(
        region, ttl_hash=get_ttl_hash()).to_dict(orient='records'),
                      default=json_serial)


@app.route('/stacked_area_regions')
def region_stacked_area():
    regions = request.args.get('regions', default='Lombardia,Veneto', type=str)
    regions = regions.split(',')
    what = request.args.get('what', default='totale_casi', type=str)
    return json.dumps(analysis.region_stacked_area(
        ','.join(regions), what, ttl_hash=get_ttl_hash()).to_dict(orient='records'),
                      default=json_serial)

@app.route('/growth_rate')
def growth_rate():
    total_time_series = analysis.total_case_time_series(
        ttl_hash=get_ttl_hash())
    y = total_time_series['totale_casi'].values
    growth_r = analysis.growth_rate(y[1:])
    growth_r = [{
        'day': d,
        'gr': gr
    } for (d, gr) in zip(total_time_series['day'].values[2:], growth_r)]
    return json.dumps(growth_r, default=json_serial)


@app.route('/province_cases_hist')
def province_cases_hist():
    normalized = request.args.get('normalized', default='', type=str)
    region = request.args.get('region', default='Veneto', type=str)
    date = request.args.get('date', default=analysis.day_list( ttl_hash=get_ttl_hash())[-1], type=str)
    return json.dumps(analysis.region_histogram(date, 
        region, normalized, ttl_hash=get_ttl_hash()).to_dict(orient='records'),
                      default=json_serial)


@app.route('/')
def hello():
    name = request.args.get("name", "World")    
    return render_template(
        'base.html',
        regions=analysis.region_list(ttl_hash=get_ttl_hash()),
        days=json.loads(json.dumps(analysis.day_list(ttl_hash=get_ttl_hash()).tolist(),
                        default=json_serial)))
