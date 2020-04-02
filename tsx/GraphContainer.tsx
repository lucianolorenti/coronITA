import { AppBar, createStyles, Divider, IconButton, makeStyles, Tab, Tabs, Theme, Toolbar, Typography } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { Dispatch, SetStateAction, useEffect, useState, FunctionComponent, forwardRef, useRef, Ref } from 'react';
import slugify from 'slugify';
import IsMobileContext from './IsMobileContext';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';







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
    settings: {
      backgroundColor: theme.palette.primary.dark
    }
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
  showTooltip?: boolean
}
const GraphContainer = (props: GraphContainerProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(props.showTooltip)
  const anchorRef = useRef<HTMLButtonElement>(null);


  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };
  function handleTooltipClose() {
    setOpenTooltip(false);
  }

  function handleTooltipOpen() {
    setOpenTooltip(true);
  }
  const close = () => {
    setOpen(false);
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

  useEffect(() => {
    if (props.showTooltip) {
      const timer = setTimeout(() => {
        setOpenTooltip(false)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [])



  const SettingsButton = () => {
    return (
      <IconButton
        ref={anchorRef}
        aria-label="open drawer"
        style={{
          backgroundColor: "#EEE",
          color: "#636eff",
          padding: "5px",
          "borderRadius": "15%"
        }}
        edge="start"
        className={classes.menuButton}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        size="small"
        onClick={handleToggle}>
        <SettingsIcon />
      </IconButton>)
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
        <Toolbar
          variant="dense">
          <Tooltip
            open={openTooltip}
            onClose={handleTooltipClose}
            onOpen={handleTooltipOpen}
            arrow
            title={<Typography
              variant="subtitle1">
              Use this button to open the plot toolbar
                </Typography>}
          >
            {SettingsButton()}
          </Tooltip>




          <div id={slugify(props.title as string)} className={classes.anchor} />
          <div>
            <Typography variant="subtitle1" noWrap>
              {props.title}
            </Typography>
            {props.subtitle === undefined ? null :
              <Typography style={{ textAlign: "center" }} variant="subtitle2" >
                {props.subtitle}
              </Typography>}

          </div>

        </Toolbar>


      </AppBar>

      <Paper square
        id={slugify(props.title as string) + "_page"}
        style={{ paddingTop: "1em", paddingLeft: "1em", paddingBottom: "1em", paddingRight: "1em" }}
        elevation={0}
        variant={'outlined'}
      >
        {props.children}
        {props.bottomElement}
      </Paper>

      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper >

              <MenuList
                className="menu"
                autoFocusItem={open}

                onKeyDown={handleListKeyDown}>
                <MenuItem onClick={close} >
                  <IconButton
                    size="small"
                    color="primary"
                  >
                    <CloseIcon />
                  </IconButton>
                </MenuItem>
                {(props.controls).map((elem, idx) => {
                  return (<MenuItem
                    style={{ paddingBottom: "0px", paddingTop: "0px" }}
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
  tabTitles: [],
  showTooltip: false

}
export default GraphContainer;
