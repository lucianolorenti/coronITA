import { makeStyles } from '@material-ui/core/styles';

export const plotHeight = 400;


export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%'
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',

    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  card: {
    maxWidth: "35em",
    marginBottom: "0.5em",
    marginLeft:"auto",
    marginRight:"auto"
  },
  menuButton: {
    marginRight: 5,
  },
  hide: {
    display: 'none',
  },
  title: {

  },
  pageTitle: {
    flexGrow: 1,

  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: '100%'
   
  },
  containerMobile: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },

  paperContent: {
    padding: theme.spacing(3),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    backgroundColor: "#F6F6F6"
  },
  paperMobileContent: {
    padding: theme.spacing(0),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  gridItem: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "1em"
  },
  gridItemMobile: {
    width: "100%",
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    
  },
  right: {
    margintLeft: "auto"
  },
  popover: {
    backgroundColor: theme.palette.primary.main,
    padding:"0.5em"
  },
  yAxisLabel: {
    "transformBox": "fill-box",
    "transformOrigin": "center",
    "transform": "rotate(-90deg)",
    "translate": "50% 0px"
  }
}));