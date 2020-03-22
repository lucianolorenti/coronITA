import { AppBar, createStyles, Divider, IconButton, makeStyles, Tab, Tabs, Theme, Toolbar, Typography, useTheme, Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useRef, useState, Dispatch, SetStateAction } from 'react';
import slugify from 'slugify';

import BuildIcon from '@material-ui/icons/Build';


import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import IsMobileContext from './IsMobileContext';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Typography>
  );
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    sidebar: {
      backgroundColor: '#FAFAFA',
      zIndex: 500,
      height: "inherit"
    },
    anchor: {
      position: "relative",
      left: "0px",
      top: "-15em",
      width: "1px",
      height: "1px"
    },
  }))


interface ShiftDrawerProps {
  open: boolean,
  height: number,
  children: React.ReactElement[]
}

interface GraphContainerProps {
  tabTitles: Array<String>;
  title: React.ReactNode,
  children: React.ReactNode,
  controls: React.ReactElement[],
  bottomElement?: React.ReactNode,
  setCurrentTab?: Dispatch<SetStateAction<number>>,
  currentTab?: number
  subtitle?: React.ReactNode
}
const GraphContainer = (props: GraphContainerProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);


  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };


  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);




  const setCurrentTab = props.setCurrentTab;
  const currentTab = props.currentTab;
  const handleCurrentTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const tabs = () => {
    return (React.Children.count(props.children) > 1 ?
      <React.Fragment>
        <Divider orientation="vertical" variant="inset" />
        <Tabs
          variant="fullWidth"
          aria-label="full width tabs example"
          value={currentTab}
          onChange={handleCurrentTabChange} >
          {React.Children.map(props.children, ((elem, idx) => {
            const tabTitle = props.tabTitles.length > idx ? props.tabTitles[idx] : "Title"
            return <Tab label={tabTitle} key={idx} {...a11yProps(idx)} />
          }))}

        </Tabs>
      </React.Fragment> : null)
  }
  return (
    <div id={slugify(props.title as string) + "_container"}>

      <AppBar
        position="static"
        elevation={0}
        style={{
          backgroundColor: "#636eff"
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"

            edge="start"
            className={classes.menuButton}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <BuildIcon />
          </IconButton>
          <div id={slugify(props.title as string)} className={classes.anchor} />
          <div>
              <Typography variant="h6" noWrap>
                {props.title}
              </Typography>
              {props.subtitle === undefined ? null :
                <Typography style={{ textAlign: "center" }} variant="subtitle2" >
                  {props.subtitle}
                </Typography>}
            
            </div>

          <IsMobileContext.Consumer>
            {isMobile => (!isMobile ? tabs() : null)}
          </IsMobileContext.Consumer>

        </Toolbar>
        <IsMobileContext.Consumer>
          {isMobile => (isMobile ? <Toolbar> {tabs()} </Toolbar> : null)}
        </IsMobileContext.Consumer>

      </AppBar>

      <Paper square
        id={slugify(props.title as string) + "_page"}
        style={{ paddingTop: "1em", paddingLeft: "1em", paddingBottom: "1em", paddingRight: "1em" }}
        elevation={0}
        variant={'outlined'}
      >
        {React.Children.count(props.children) > 1 ?
          React.Children.map(props.children, (elem, idx) => {
            return (
              <TabPanel key={idx} value={currentTab} index={idx}>
                {elem}
              </TabPanel>
            )
          }) : props.children}
        {props.bottomElement}
      </Paper>

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>

              <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                {(props.controls).map((elem, idx) => {
                  return (<MenuItem
                    button
                    key={idx}
                  >
                    {elem}
                  </MenuItem>)
                })}
              </MenuList>

            </Paper>
          </Grow>
        )}
      </Popper>


    </div>)
}
GraphContainer.defaultProps = {
  tabTitles: []
}
export default GraphContainer;