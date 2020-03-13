import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
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
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Title from './Title';
import Drawer from './Drawer';
import DeadProportion from './DeadProportion';
import StackedAreas from './StackedAreas';
import GitHubIcon from '@material-ui/icons/GitHub';
import StackedRegions from './StackedRegions'
import MapTab from './Map'



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





interface VizElement {
  title: string,
  component: JSX.Element
}

export default function Dashboard() {
  const classes = useStyles();
  const [drawer, setDrawer] = React.useState(false);
  const toggleDrawer = (open: boolean) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawer(open)
  };
  const [toc, setToc] = React.useState([]);

  const element: VizElement[] = [
    { title: "Time series of infected persons", component: <TotalCasesTimesSeriesTab /> },
    { title: "Persons affected by the virus", component: <StackedAreas />},
    { title: "Affected by region", component: <StackedRegions />},
    { title: "Map of infected people", component: <MapTab />},
    { title: "Percetange of deceased people vs positive cases", component: <DeadProportion />},
    { title: "Percetange of infected person vs tests", component: <TamponiInfectedRatioSeries /> },
    { title: "Cases per region", component: <TotalCasesHistogram /> },
    { title: "Cases per province", component: <ProvincePlot /> }]


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            edge="start"
            className={clsx(classes.menuButton, drawer && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap className={classes.pageTitle}>
            COVID-19       <ReactCountryFlag
              className="emojiFlag"
              countryCode="IT"
              style={{
                fontSize: '2em',
                lineHeight: '2em',
              }}
              aria-label="Italy"
            />
          </Typography>
          <Typography variant="subtitle1" color="inherit" noWrap className={classes.right}>
          <Link href="https://github.com/lucianolorenti/coronITA" color="inherit"> 
          <GitHubIcon style={{top: "5px", position:"relative"}} /> Fork me on Github   
          </Link>
            </Typography> 
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Drawer drawer={drawer} toggleDrawer={toggleDrawer} toc={element} />
          <Paper className={classes.paper} >

            <Link href="https://github.com/pcm-dpc/COVID-19" >
              <InfoIcon style={{ "paddingTop": "0.5em" }} />  Data Provided by Presidenza del Consiglio dei Ministri - Dipartimento della Protezione Civile
            </Link>

            <Grid container spacing={3}>
              {element.map((elem: VizElement, index: number) => {
                return (
                  <Grid item xs={12} key={index}>
                    <div className={classes.gridelement}>
                    <Title >
                      {elem.title}
                    </Title>
                    {elem.component}
                    </div>
                  </Grid>
                  
                  )
              })}
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