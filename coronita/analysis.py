import pandas as pd
from pathlib import Path
import functools
import numpy as np 


CURR_DIR = Path(__file__).resolve().parent
DATA_DIR = CURR_DIR.parent / 'data'


@functools.lru_cache(maxsize=32)
def data_andamento_nazionale():
    d = pd.read_csv(DATA_DIR / 'dpc-covid19-ita-andamento-nazionale.csv')
    d['data'] = pd.to_datetime(d['data'])
    d['day'] = d['data'].dt.date
    d.set_index('day', inplace=True)
    return d


@functools.lru_cache(maxsize=32)
def tamponi_infected_ratio():
    d = data_andamento_nazionale()
    data = pd.DataFrame(d['totale_casi']/d['tamponi']*100, columns=['percentage'])
    data['totale_casi'] = d['totale_casi']
    data['tamponi'] = d['tamponi']
    data['percentage'] = data['percentage'].round(decimals=2)
    data.reset_index(inplace=True)
    return data

@functools.lru_cache(maxsize=32)
def region_population():
     d = pd.read_csv(DATA_DIR / 'region_population.csv',  thousands=',')
     d.set_index('Region', inplace=True)
     return d


@functools.lru_cache(maxsize=32)
def provinces_data():
     d = pd.read_csv(DATA_DIR / 'province_data.csv', encoding='utf8')     
     d['Population'] = d['Population'].str.replace('\xa0','')
     d['Population'] = d['Population'].str.replace(' ','' )
     d['Population'] = pd.to_numeric(d['Population'])
     d.set_index('Province', inplace=True)
     return d


@functools.lru_cache(maxsize=32)
def region_list():
    data = read_data()
    return sorted(np.unique(data['denominazione_regione']))


@functools.lru_cache(maxsize=32)
def provinces_list(region):
    data = read_data()
    return sorted(np.unique(data[data['denominazione_regione'] == region]['denominazione_provincia']))
    

@functools.lru_cache(maxsize=32)
def read_data():
    data = pd.read_csv(DATA_DIR / 'dpc-covid19-ita-province.csv')
    data['data'] = pd.to_datetime(data['data'])
    data['day'] = data['data'].dt.date
    return data


@functools.lru_cache(maxsize=32)
def total_case_histogram(normalize=''):
    normalize_data = None
    if len(normalize) > 0:  
        region_data = region_population()          
        if (normalize in region_data.columns):            
            normalize_data = region_data[normalize]

    data = read_data()
    hist = (data[['denominazione_regione', 'totale_casi']]
            .groupby('denominazione_regione')
            .agg('sum')
            .sort_values('totale_casi')
            .reset_index()
            .set_index('denominazione_regione'))
    if normalize_data is not None:
        hist['totale_casi'] = hist['totale_casi'] / normalize_data
    hist.reset_index(inplace=True)
    return hist



@functools.lru_cache(maxsize=32)
def total_case_time_series():
    data = read_data()
    return (data[['day', 'totale_casi']]
        .groupby('day')
        .agg('sum')
        .sort_values('totale_casi')
        .reset_index()
        .copy())


@functools.lru_cache(maxsize=32)
def fit_exponential():
    total_time_series = total_case_time_series()
    y = total_time_series['totale_casi'].values
    x = np.array(range(0, len(y)))
    growth_rate = np.exp(np.diff(np.log(y))) - 1
    (a, b) = np.polyfit(x, np.log(y + 0.000000000001), 1, w=np.sqrt(y+ 0.000000000001))
    fitted_y = np.exp(b) * np.exp(a*x) 
    return ((a, np.exp(b)), fitted_y)


@functools.lru_cache(maxsize=32)
def region_histogram(region, normalize=''):
    data = read_data()
    data = data[data['denominazione_regione'] == region]
    if data.empty:
        return []
    normalize_data = None
    if len(normalize) > 0:  
        province_data = provinces_data()          
        if (normalize in province_data.columns):            
            normalize_data = province_data[normalize]
    data = (data[['denominazione_provincia', 'totale_casi']]  
            .groupby('denominazione_provincia')
            .agg('sum')
            .sort_values('totale_casi')
            .reset_index()
            .set_index('denominazione_provincia'))
    if normalize_data is not None:
        data['totale_casi'] = data['totale_casi'] / normalize_data
        data.dropna(inplace=True)
        
    data.reset_index(inplace=True)
    return data

def growth_rate(d):
    return np.exp(np.diff(np.log(d)))