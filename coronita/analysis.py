import functools
import logging
import time
import urllib.request
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.optimize import curve_fit
from datetime import timedelta 


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CURR_DIR = Path(__file__).resolve().parent
DATA_DIR = CURR_DIR.parent / 'data'


def get_ttl_hash(seconds=60 * 60 * 12):
    """Return the same value withing `seconds` time period"""
    return round(time.time() / seconds)


def download_file(url, file):
    logger.info(f'Removing old file {file.name}')
    if file.is_file():
        file.unlink()
    logger.info(f'Downloading file {file.name}')
    urllib.request.urlretrieve(url, str(file))


@functools.lru_cache(maxsize=32)
def map_str():
    URL = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson"
    FILE_PATH = DATA_DIR / 'limits_IT_regions.geojson'
    #download_file(URL, FILE_PATH)
    with open(FILE_PATH, "r") as f:
        data = f.read()
    return data


@functools.lru_cache(maxsize=32)
def map_locations(date, ttl_hash=None):
    data = data_province(ttl_hash=ttl_hash)
    data = data[data['day'] == pd.to_datetime(
        date, format='%Y-%m-%d', errors='coerce')]
    return data[['lat', 'long', 'totale_casi']].dropna()


def process_df(d):
    d['data'] = pd.to_datetime(d['data'])
    d['day'] = d['data'].dt.date
    d['denominazione_regione'] = d['denominazione_regione'].str.replace(
        'P.A. Bolzano', 'Bolzano')
    d['denominazione_regione'] = d['denominazione_regione'].str.replace(
        'P.A. Trento', 'Trento')


@functools.lru_cache(maxsize=32)
def data_andamento_nazionale(ttl_hash=None):
    FILE_PATH = DATA_DIR / 'dpc-covid19-ita-andamento-nazionale.csv'
    URL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-andamento-nazionale/dpc-covid19-ita-andamento-nazionale.csv"
    download_file(URL, FILE_PATH)
    d = pd.read_csv(FILE_PATH)
    d['data'] = pd.to_datetime(d['data'])
    d['day'] = d['data'].dt.date

    d.set_index('day', inplace=True)
    return d


@functools.lru_cache(maxsize=32)
def data_regioni(ttl_hash=None):
    URL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv"
    FILE_PATH = DATA_DIR / 'dpc-covid19-ita-regioni.csv'
    download_file(URL, FILE_PATH)
    d = pd.read_csv(FILE_PATH)
    process_df(d)
    feats = [
        'ricoverati_con_sintomi', 'terapia_intensiva',
        'totale_ospedalizzati', 'isolamento_domiciliare',
        'totale_attualmente_positivi', 'nuovi_attualmente_positivi',
        'dimessi_guariti', 'deceduti', 'totale_casi', 'tamponi'
    ]
    d.loc[d['denominazione_regione'] == 'Bolzano',
          'denominazione_regione'] = 'Trentino'
    for day in np.unique(d['day']):        
        s = d[(d['denominazione_regione'] == 'Trento')
              & (d['day'] == day)][feats]
        for f in feats:
            d.loc[(d['denominazione_regione'] == 'Trentino') &
                  (d['day'] == day), f] += s[f].values[0] if len(s[f].values)> 0 else 0
    d.drop(d[d['denominazione_regione'] == 'Trento'].index, inplace=True)
    return d


@functools.lru_cache(maxsize=32)
def data_province(ttl_hash=None):
    FILE_PATH = DATA_DIR / 'dpc-covid19-ita-province.csv'
    URL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv"
    download_file(URL, FILE_PATH)
    data = pd.read_csv(FILE_PATH)
    process_df(data)
    data.loc[data['denominazione_regione'] == 'Bolzano',
              'denominazione_regione'] = 'Trentino'
    data.loc[data['denominazione_regione'] == 'Trento',
              'denominazione_regione'] = 'Trentino'
    return data


@functools.lru_cache(maxsize=32)
def day_list(ttl_hash=None):
    data = data_andamento_nazionale(ttl_hash=ttl_hash)
    return data.index.unique().values


@functools.lru_cache(maxsize=32)
def dead_proportion(region='All', ttl_hash=None):

    if region == 'All':
        data = data_andamento_nazionale(ttl_hash=ttl_hash)
    else:
        data = data_regioni(ttl_hash=ttl_hash)
        if region not in data['denominazione_regione'].unique():
            return pd.DataFrame()
        data = data[data['denominazione_regione'] == region].copy()
        data.set_index('day', inplace=True)

    d = pd.DataFrame(data['deceduti'] / data['totale_casi'] * 100,
                     columns=['percentage'])
    d['totale_casi'] = data['totale_casi']
    d['deceduti'] = data['deceduti']
    d['percentage'] = d['percentage'].round(decimals=2)
    d.dropna(inplace=True)
    d.reset_index(inplace=True)
    return d


@functools.lru_cache(maxsize=32)
def stacked_area_data(region='All', ttl_hash=None):
    if region == 'All':
        data = data_andamento_nazionale(ttl_hash=ttl_hash)
    else:
        data = data_regioni(ttl_hash=ttl_hash)
        if region not in data['denominazione_regione'].unique():
            return pd.DataFrame()
        data = data[data['denominazione_regione'] == region]
        data.set_index('day', inplace=True)
    data = data[[
        'ricoverati_con_sintomi', 'terapia_intensiva',
        'isolamento_domiciliare', 'dimessi_guariti', 'deceduti'
    ]]
    data.reset_index(inplace=True)
    return data


@functools.lru_cache(maxsize=32)
def region_stacked_area(regions, what='terapia_intensiva', ttl_hash=None):
    if isinstance(regions, str):
        regions = regions.split(',')
    data = data_regioni(ttl_hash=ttl_hash)
    data = data[data['denominazione_regione'].isin(regions)]    
    data = data[['day', 'denominazione_regione', what]].copy()
    data = data[['day','denominazione_regione', what]].pivot(index='day', columns='denominazione_regione', values=what)
    data.rename({what: 'data'}, inplace=True)
    data.reset_index('day', inplace=True)
    return data


@functools.lru_cache(maxsize=32)
def tamponi_infected_ratio(region, ttl_hash=None):
    if region == 'All':
        d = data_andamento_nazionale(ttl_hash=ttl_hash)
    else:
        d = data_regioni(ttl_hash=ttl_hash)
        if region not in d['denominazione_regione'].unique():
            return pd.DataFrame()
        d = d[d['denominazione_regione'] == region]
        d.set_index('day', inplace=True)
        if d.empty:
            return pd.DataFrame()
    data = pd.DataFrame(d['totale_casi'] / d['tamponi'] * 100,
                        columns=['percentage'])
    data['totale_casi'] = d['totale_casi']
    data['tamponi'] = d['tamponi']
    data['percentage'] = data['percentage'].round(decimals=2)
    data.reset_index(inplace=True)
    return data


@functools.lru_cache(maxsize=32)
def region_population(ttl_hash=None):
    d = pd.read_csv(DATA_DIR / 'region_population.csv', thousands=',')
    d.set_index('Region', inplace=True)
    return d


@functools.lru_cache(maxsize=32)
def provinces_data(ttl_hash=None):
    d = pd.read_csv(DATA_DIR / 'province_data.csv', encoding='utf8')
    d['Population'] = d['Population'].str.replace('\xa0', '')
    d['Population'] = d['Population'].str.replace(' ', '')
    d['Population'] = pd.to_numeric(d['Population'])
    d.set_index('Province', inplace=True)
    return d.to_dict(orient='index')


@functools.lru_cache(maxsize=32)
def provinces_list(region, ttl_hash=None):
    data = data_province(ttl_hash=ttl_hash)
    data = data[data['denominazione_regione'] == region]
    return data['denominazione_provincia'].unique().values

@functools.lru_cache(maxsize=32)
def region_list(ttl_hash=None):
    data = data_province(ttl_hash=ttl_hash)
    return sorted(np.unique(data['denominazione_regione']))


@functools.lru_cache(maxsize=32)
def provinces_list(region, ttl_hash=None):
    data = data_province(ttl_hash=ttl_hash)
    return sorted(
        np.unique(data[data['denominazione_regione'] == region]
                  ['denominazione_provincia']))


@functools.lru_cache(maxsize=32)
def total_case_histogram(date, normalize='', ttl_hash=None):
    normalize_data = None
    if len(normalize) > 0:
        region_data = region_population()
        if (normalize in region_data.columns):
            normalize_data = region_data[normalize]

    data = data_province(ttl_hash=ttl_hash)
    data = data[data['day'] == pd.to_datetime(
        date, format='%Y-%m-%d', errors='coerce')]
    hist = (data[[
        'denominazione_regione', 'totale_casi'
    ]].groupby('denominazione_regione').agg('sum').sort_values(
        'totale_casi').reset_index().set_index('denominazione_regione'))
    hist['totale_casi'] = hist['totale_casi'].astype(float)
    if normalize_data is not None:
        hist['totale_casi'] =1000*(hist['totale_casi'] / normalize_data)
    hist.reset_index(inplace=True)
    hist.dropna(inplace=True)
    return hist


@functools.lru_cache(maxsize=32)
def total_case_time_series_country(ttl_hash=None):
    data = data_andamento_nazionale(ttl_hash=ttl_hash).reset_index()
    return data[['day', 'totale_casi']]


@functools.lru_cache(maxsize=32)
def total_case_time_series_region(region, ttl_hash=None):
    data = data_regioni(ttl_hash=ttl_hash).reset_index()
    data = data[data['denominazione_regione'] == region]
    return data[['day', 'totale_casi']]


def sigmoid(x, L ,x0, k, b):
    y = (L / (1 + np.exp(-k*(x-x0))))+b
    return (y)


def fit_curve(y, n=None):
    x = np.array(range(0, len(y)))
    p0 = [max(y), np.median(x),1,min(y)]
    popt, pcov = curve_fit(sigmoid, x, y, p0, method='dogbox', maxfev=50000)
    if n is not None:
        x = np.array(range(0, n))    
    fitted_y = [max(int(y), 0) for y in sigmoid(x, *popt)]
    return (popt, fitted_y)


def fit_curve1(y, n=None):
    x = np.array(range(0, len(y)))
    (a, b) = np.polyfit(x,
                        np.log(y + 0.000000000001),
                        1,
                        w=np.sqrt(y + 0.000000000001))
    if n is not None:
        x = np.array(range(0, n))    
    fitted_y = np.exp(b) * np.exp(a * x)
    return ((np.exp(a), np.exp(b)), fitted_y)


@functools.lru_cache(maxsize=32)
def total_time_series_data_country(additional_days=0, ttl_hash=None):
    total_time_series = total_case_time_series_country(ttl_hash=ttl_hash).copy()
    
    y = total_time_series['totale_casi'].values
    
    (params, fitted_y) = fit_curve(y, n=len(y)+additional_days)
    (params, fitted_y_2) = fit_curve(y[:-2], n=len(y)+additional_days)
    (params, fitted_y_7) = fit_curve(y[:-5], n=len(y)+additional_days)
    last_day = total_time_series.iloc[-1, :]['day']
    for i in range(additional_days):
        next_day = (last_day + timedelta(days=(i+1))).strftime("%Y-%m-%d")
        total_time_series = total_time_series.append({'day': next_day, 'totale_casi': None},  ignore_index=True)
    
    total_time_series['fitted'] = np.round(fitted_y, decimals=2)
    total_time_series['fitted_2'] = np.round(fitted_y_2, decimals=2)
    total_time_series['fitted_7'] = np.round(fitted_y_7, decimals=2)
    return {'data': total_time_series, 'coeffs': params.tolist()}
    

@functools.lru_cache(maxsize=32)
def growth_rate_data(regions, method='gr', ttl_hash=None):
    if isinstance(regions, str):
        regions = regions.split(',')
    if method == 'gr':
        fun = growth_rate
    else:
        fun = difference
    data = None
    coeffs = None
    if 'All' in regions:
        total_time_series = total_case_time_series_country(ttl_hash=ttl_hash).copy()
        y = total_time_series['totale_casi'].values
        growth_r = fun(y[1:])
        data = [{'day': d, 'gr': gr} 
                     for (d, gr) in zip(total_time_series['day'].values[2:], growth_r)]
        regions.remove('All')
    for region in regions:
        total_time_series = total_case_time_series_region(region,ttl_hash=ttl_hash)
        y = total_time_series['totale_casi'].values
        growth_r = fun(y[1:])
        if data is None:
            data = [{'day': d, f'gr_{region}': gr if gr < 3 else None  } 
                     for (d, gr) in zip(total_time_series['day'].values[2:], growth_r)]
        else:
            for elem, gr in zip(data, growth_r):
                elem[f'gr_{region}'] = gr if gr < 3 else None             
    return data


def total_time_series_data(regions, additional_days=0, ttl_hash=None):
    if isinstance(regions, str):
        regions = regions.split(',')
    data = None
    coeffs = None
    if 'All' in regions:
        data = total_time_series_data_country(additional_days=additional_days, ttl_hash=ttl_hash).copy()
        coeffs = data['coeffs']
        data = data['data'].copy()
        regions.remove('All')
    
    for region in regions:
        total_time_series = total_case_time_series_region(region, ttl_hash=ttl_hash).copy().reset_index()
        last_day = total_time_series.iloc[-1, :]['day']
        for i in range(additional_days):
            next_day = (last_day + timedelta(days=(i+1))).strftime("%Y-%m-%d")
            total_time_series = total_time_series.append({'day': next_day, 'totale_casi': None},  ignore_index=True)
        if data is None:
            data = total_time_series
            data.rename(columns={'totale_casi': f'totale_casi_{region}'}, inplace=True)
        else:
            data[f'totale_casi_{region}'] = total_time_series['totale_casi']
    if data is None:
        data = pd.DataFrame()     
    if 'index' in data.columns:
        data.drop(columns=['index'], inplace=True)

    data = {'data': data.to_dict(orient='records')}
    
    if coeffs is not None:
        data['coeffs'] = coeffs
  
    return data


  

@functools.lru_cache(maxsize=32)
def region_histogram(date, region, normalize='', ttl_hash=None):
    data = data_province(ttl_hash=ttl_hash)
    data = data[data['denominazione_regione'] == region]
    if data.empty:
        return []
    normalize_data = None
    if len(normalize) > 0:
        normalize_data = provinces_data()        
    data = data[data['day'] == pd.to_datetime(
        date, format='%Y-%m-%d', errors='coerce')]
    data = (data[[
        'denominazione_provincia', 'totale_casi'
    ]].groupby('denominazione_provincia').agg('sum').sort_values(
        'totale_casi').reset_index())
    data['totale_casi'] = data['totale_casi'].astype('float')
    if normalize_data is not None:
        for i in data.index:
            province = data.at[i, 'denominazione_provincia']
            curr_value = data.at[i, 'totale_casi']
            normalize_val = normalize_data.get(province, {}).get(normalize, np.nan)
            data.at[i, 'totale_casi'] = (curr_value / normalize_val) * 1000
        data.dropna(inplace=True)

    data.reset_index(inplace=True)
    return data


@functools.lru_cache(maxsize=32)
def provinces_time_series(region, normalize='', ttl_hash=None):
    data = data_province(ttl_hash=ttl_hash)
    data = data[data['denominazione_regione'] == region]
    if data.empty:
        return []
    normalize_data = None
    if len(normalize) > 0:
        normalize_data = provinces_data()        
    data = (data[[
        'day',  'denominazione_provincia', 'totale_casi'
    ]].groupby(['day', 'denominazione_provincia']).agg('sum').sort_values(
        'totale_casi').reset_index())
    data['totale_casi'] = data['totale_casi'].astype(float)
    if normalize_data is not None:
        for i in data.index:
            province = data.at[i, 'denominazione_provincia']
            curr_value = data.at[i, 'totale_casi']
            normalize_val = normalize_data.get(province, {}).get(normalize, np.nan)
            data.at[i, 'totale_casi'] = 1000 *( curr_value / normalize_val)   
        data.dropna(inplace=True)

    data.reset_index(inplace=True)
    data = data.pivot(index='day', columns='denominazione_provincia', values='totale_casi')
    data.reset_index(inplace=True)
    return data



def growth_rate(d):
    return np.exp(np.diff(np.log(d)))

def difference(d):
    return np.diff(d).astype(float)