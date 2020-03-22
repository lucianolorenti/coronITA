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
    return json.dumps(analysis.tamponi_infected_ratio(
        region, ttl_hash=get_ttl_hash()).to_dict(orient='records'),
                      default=json_serial)


@app.route('/cases_hist')
def cases_hist():
    normalized = request.args.get('normalized', default='', type=str)
    date = request.args.get(
        'date',
        default=analysis.day_list(ttl_hash=get_ttl_hash())[-1],
        type=str)
    return json.dumps(
        analysis.total_case_histogram(
            date, normalized,
            ttl_hash=get_ttl_hash()).to_dict(orient='records'))


@app.route('/map')
def map():
    return analysis.map_str()


@app.route('/map_markers')
def map_markers():
    date = request.args.get('date', default='2020-03-11', type=str)
    return json.dumps(
        analysis.map_locations(
            date, ttl_hash=get_ttl_hash()).to_dict(orient='records'))


@app.route('/total_time_serie')
def total_time_serie():
    regions = request.args.get('regions', default='All', type=str)
    predictedDays = request.args.get('predictedDays', default=0, type=int)
    return json.dumps(analysis.total_time_series_data(regions,
                                                      predictedDays,
                                                      ttl_hash=get_ttl_hash()),
                      default=json_serial)


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
        ','.join(regions), what,
        ttl_hash=get_ttl_hash()).to_dict(orient='records'),
                      default=json_serial)


@app.route('/growth_rate')
def growth_rate():
    regions = request.args.get('regions', default='All', type=str)
    method = request.args.get('method', default='gr', type=str)
    return json.dumps(analysis.growth_rate_data(regions,
                                                method,
                                                ttl_hash=get_ttl_hash()),
                      default=json_serial)


@app.route('/province_cases_hist')
def province_cases_hist():
    normalized = request.args.get('normalized', default='', type=str)
    region = request.args.get('region', default='Veneto', type=str)
    date = request.args.get(
        'date',
        default=analysis.day_list(ttl_hash=get_ttl_hash())[-1],
        type=str)
    return json.dumps(analysis.region_histogram(
        date, region, normalized,
        ttl_hash=get_ttl_hash()).to_dict(orient='records'),
                      default=json_serial)


@app.route('/last_data')
def last_data():
    data = analysis.data_andamento_nazionale(ttl_hash=get_ttl_hash())
    return json.dumps(data.tail(1).to_dict(orient='records'),
                      default=json_serial)


@app.route('/province_cases')
def province_cases():
    normalized = request.args.get('normalized', default='', type=str)
    region = request.args.get('region', default='Veneto', type=str)
    return json.dumps(
        {
            'data':
            analysis.provinces_time_series(
                region, normalized,
                ttl_hash=get_ttl_hash()).to_dict(orient='records'),
            'provinces':
            analysis.provinces_list(region, ttl_hash=get_ttl_hash())
        },
        default=json_serial)


@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return render_template(
        'base.html',
        regions=analysis.region_list(ttl_hash=get_ttl_hash()),
        days=json.loads(
            json.dumps(analysis.day_list(ttl_hash=get_ttl_hash()).tolist(),
                       default=json_serial)))


@app.rotue('/.well-known/acme-challenge/-XqtlB8yCOEBDD66TLrNRL70OTCWkjpjmOvgdbGfV4k')
def cert():
    return "-XqtlB8yCOEBDD66TLrNRL70OTCWkjpjmOvgdbGfV4k.99X3nqA8oAqJ1r9Fqeiihec0IQClBg0OpaBNg22kvWw"