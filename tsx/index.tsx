import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import 'katex/dist/katex.min.css';
import React from 'react';
import ReactCountryFlag from "react-country-flag";
import ReactDOM from 'react-dom';
import TamponiInfectedRatioSeries from './InfectedRatio';
import ProvincePlot from './ProvincePlot';
import { useStyles } from './styles';
import TotalCasesHistogram from './TotalCasesHistogram';
import TotalCasesTimesSeriesTab from './TotalCasesTimeSeries';
import InfoIcon from '@material-ui/icons/Info';






function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/lucianolorenti">
        Luciano Lorenti
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}





export default function Dashboard() {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            CoronaVirus       <ReactCountryFlag
              className="emojiFlag"
              countryCode="IT"
              style={{
                fontSize: '2em',
                lineHeight: '2em',
              }}
              aria-label="Italy"
            />
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
 
          <Paper className={classes.paper} >
     
          <Link href="https://github.com/pcm-dpc/COVID-19" >
          <InfoIcon style={{"paddingTop":"0.5em"}} />  Data Provided by Presidenza del Consiglio dei Ministri - Dipartimento della Protezione Civile
            </Link>
    
            <Grid container spacing={3}>


              <Grid item xs={12}>
                <TotalCasesTimesSeriesTab />
              </Grid>
              <Grid item xs={12} >
                <TamponiInfectedRatioSeries />
              </Grid>
              <Grid item xs={12} >
                <TotalCasesHistogram />
              </Grid>
              <Grid item xs={12}>
                <ProvincePlot />
              </Grid>

            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Paper>
        </Container>
      </main>
    </div>
  );
}

ReactDOM.render(
  <Dashboard />,
  document.getElementById('root')
);