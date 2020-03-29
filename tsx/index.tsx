import { Button, IconButton, Popover } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';
import RedditIcon from '@material-ui/icons/Reddit';
import ShareIcon from '@material-ui/icons/Share';
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import clsx from 'clsx';
import 'katex/dist/katex.min.css';
import React from 'react';
import ReactCountryFlag from "react-country-flag";
import ReactDOM from 'react-dom';
import { FacebookShareButton, RedditShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import withSizes from 'react-sizes';
import DeadProportion from './DeadProportion';
import Drawer from './Drawer';
import TamponiInfectedRatioSeries from './InfectedRatio';
import IsMobileContext from './IsMobileContext';
import MapTab from './Map';
import ProvincePlot from './ProvincePlot';
import ProvinceTimeSeriesPlot from './ProvinceTimeSeries';
import StackedAreas from './StackedAreas';
import StackedRegions from './StackedRegions';
import { useStyles } from './styles';
import TotalCasesHistogram from './TotalCasesHistogram';
import TotalCasesTimesSeriesTab from './TotalCasesTimeSeries';
import { useTheme } from '@material-ui/core/styles';



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
  Component: React.ElementType
}
interface DashboardProps {
  isMobile: boolean
}
function DashboardWithSizes(props: DashboardProps) {
  const { isMobile } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [drawer, setDrawer] = React.useState(false);
  const toggleDrawer = (open: boolean) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawer(open)
  };
  const [shareMenuAnchorEl, setShareMenuAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleShareButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setShareMenuAnchorEl(null);
  };
  const open = Boolean(shareMenuAnchorEl);
  const share_menu_id = open ? 'share-menu-popover' : undefined;

  const element: VizElement[] = [
    // { title: "Cases", component: <SankeyCases /> },
    { title: "Time series of infected people", Component: TotalCasesTimesSeriesTab },
    { title: "People affected by the virus", Component: StackedAreas },
    { title: "Affected by region", Component: StackedRegions },
    { title: "Map of infected people", Component: MapTab },
    { title: "Percentage of deceased people vs positive cases", Component: DeadProportion },
    { title: "Percentage of infected people vs tests", Component: TamponiInfectedRatioSeries },
    { title: "Cases per region", Component: TotalCasesHistogram },
    { title: "Evolution of cases per province", Component: ProvinceTimeSeriesPlot },
    { title: "Cases per province", Component: ProvincePlot }
  ]

  const ShareButtons = () => {
    return <React.Fragment>
      <FacebookShareButton style={{padding: "0.5em"}} url="http://italiacovid.online/" >
        <FacebookIcon  style={{color: "#FFF"}} />
      </FacebookShareButton>
      <WhatsappShareButton style={{padding: "0.5em"}}  url="http://italiacovid.online/" >
        <WhatsAppIcon style={{color: "#FFF"}} />
      </WhatsappShareButton>
      <TelegramShareButton style={{padding: "0.5em"}}  url="http://italiacovid.online/" >
        <TelegramIcon style={{color: "#FFF"}} />
      </TelegramShareButton>
      <TwitterShareButton style={{padding: "0.5em"}} url="http://italiacovid.online/" >
        <TwitterIcon  style={{color: "#FFF"}}/>
      </TwitterShareButton>
      <RedditShareButton style={{padding: "0.5em"}}  url="http://italiacovid.online/" >
        <RedditIcon style={{color: "#FFF"}}/>
      </RedditShareButton>
    </React.Fragment>
  }

  const ShareMenu = () => {
    return <React.Fragment>
      <IconButton
        aria-describedby={share_menu_id}
        aria-label="share"
        color="inherit"
        edge="start"
        component="span" onClick={handleShareButtonClick} >
        <ShareIcon />
      </IconButton>
      <Popover
        id={share_menu_id}
        open={open}
        anchorEl={shareMenuAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
       
      >
        <div className={classes.popover}>
          {ShareButtons()}
        </div>
      </Popover>
    </React.Fragment>
  }
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
            {isMobile ? "COVID-19 Italy" : "Coronavirus COVID-19 in Italy"}
            <ReactCountryFlag
            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
              countryCode="IT"
              style={{
                fontSize: '2em',
                lineHeight: '2em',
              }}
              aria-label="Italy"
              svg
            />
          </Typography>
           {ShareMenu() }


          <Typography variant="subtitle1" color="inherit" noWrap className={classes.right}>
            <Link href="https://github.com/lucianolorenti/coronITA" color="inherit">
              <GitHubIcon style={{ top: "5px", position: "relative" }} /> {props.isMobile ? null : "Fork me on Github"}
            </Link>
          </Typography>
        </Toolbar>

      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={isMobile ? classes.containerMobile : classes.container}>
          <Drawer drawer={drawer} toggleDrawer={toggleDrawer} toc={element} />


          <Link href="https://github.com/pcm-dpc/COVID-19" >
            <InfoIcon style={{ "paddingTop": "0.5em" }} />  Data Provided by Presidenza del Consiglio dei Ministri - Dipartimento della Protezione Civile
            </Link>

          <Grid container >
            <IsMobileContext.Provider value={isMobile}>
              {element.map((elem: VizElement, index: number) => {
                return (
                  <Grid item className={isMobile ? classes.gridItemMobile : classes.gridItem} key={index}>
                    <elem.Component isMobile={isMobile} title={elem.title} />
                  </Grid>

                )
              })}
            </IsMobileContext.Provider>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>

        </Container>
      </main>
    </div>
  );
}
const mapSizesToProps = ({ width }) => {
  return {
    isMobile: width < 480,
  }
}
const Dashboard = withSizes(mapSizesToProps)(DashboardWithSizes)
ReactDOM.render(
  <Dashboard />,
  document.getElementById('root')
);
