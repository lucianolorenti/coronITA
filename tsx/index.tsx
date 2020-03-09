import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import clsx from 'clsx';
import 'katex/dist/katex.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import ProvincePlot from './ProvincePlot';
import { useStyles } from './styles';
import TotalCasesHistogram from './TotalCasesHistogram';
import TotalCasesTimesSeriesTab from './TotalCasesTimeSeries';






function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
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
            CoronaVirus
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
        <Paper className={classes.paper} >
          <Grid container spacing={3}>
            {/* Chart */}
           


            <Grid item xs={12}>
                <TotalCasesTimesSeriesTab />
            </Grid>
            <Grid item xs={12} >
                <TotalCasesHistogram  />
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