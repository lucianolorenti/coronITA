# Dashboard of Coronavirus in Italy
## [Live!](https://itacovid-19.herokuapp.com/)

## Description 
The [Civil Protection Department is publishing reliable data about the incidence of this virus in the Italian Population](https://github.com/pcm-dpc/COVID-19).
This dashboard shows the developing of the disease in Italy and its provinces. It is automatically updated every 12 hours.

## Screenshot

![Screenshot](/doc/screenshot.png)

## Tools
### Frontend 
 * Typescript
 * React
 * Recharts
 * Material-ui
 
### Backend
  * Python
  * Flask
  * Pandas
  * numpy

## How to run it locally for development
```
git clone https://github.com/lucianolorenti/coronITA.git

pip install -e coronITA
cd coronITA
env FLASK_ENV=development FLASK_APP=coronita/server.py flask run
```
### If you want to generate the .js of the frontend
```bash
cd coronITA
npm install
webpack
```