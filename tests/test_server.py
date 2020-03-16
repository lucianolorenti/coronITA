import os
import tempfile
import json
import pytest
import numpy as np
from coronita import app


@pytest.fixture
def client():    
    app.config['TESTING'] = True

    with app.test_client() as client:
        yield client


def test_tamponi_infected_ratio(client):
    """Test Tamponi Infected Ratio."""

    rv = client.get('/tamponi_infected_ratio')
    data = json.loads(rv.data)
    assert isinstance(data, list)
    assert len(data) > 0
    keys = ["day", "percentage", "totale_casi", "tamponi"]
    assert set(data[0].keys()) == set(keys)


def test_cases_hist(client):
    rv = client.get('/cases_hist')
    data = json.loads(rv.data)
    assert isinstance(data, list)
    assert len(data) == 20
    assert set(data[0].keys()) == set(['denominazione_regione', 'totale_casi'])


def test_total_time_serie(client):
    def _test(client, regions=''):
        if len(regions) == 0:
            rv = client.get('/total_time_serie')
        else:
            rv = client.get('/total_time_serie?regions=' + regions)
        data = json.loads(rv.data)
        assert isinstance(data, dict)        
        assert ('data' in data)        
        assert isinstance(data['data'], list) > 0
        assert len(data['data']) > 0
        return data
    
    data = _test(client)
    keys = ['day', 'totale_casi', 'fitted', 'fitted_2', 'fitted_7']
    assert set(data['data'][0].keys()) == set(keys)
    assert ('coeffs' in data)
    assert np.isscalar(data['coeffs'][0]) == True
    assert np.isscalar(data['coeffs'][1]) == True

    data = _test(client, 'All')
    assert set(data['data'][0].keys()) == set(keys)
    assert ('coeffs' in data)
    assert np.isscalar(data['coeffs'][0]) == True
    assert np.isscalar(data['coeffs'][1]) == True

    data = _test(client, 'Abruzzo')
    assert ('coeffs' not in data)
    keys = ['day', 'totale_casi_Abruzzo']
    assert set(data['data'][0].keys()) == set(keys)

    data = _test(client, 'All,Abruzzo')
    assert ('coeffs' in data)
    keys = ['day', 'totale_casi_Abruzzo', 'totale_casi', 'fitted', 'fitted_2', 'fitted_7']
    assert set(data['data'][0].keys()) == set(keys)
    assert np.isscalar(data['coeffs'][0]) == True
    assert np.isscalar(data['coeffs'][1]) == True




    