import React, { FunctionComponent, useEffect } from "react";
import slugify from 'slugify';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './styles';
import { AppBar, Toolbar } from "@material-ui/core";

interface TitleProps {
  children: string,
  isMobile: boolean
}


const Title: FunctionComponent<TitleProps> = (props: TitleProps) => {
  const classes = useStyles();
  console.log(props.children)
  return (
    <React.Fragment>
      <div id={slugify(props.children)} className={classes.anchor} />
      <AppBar position="static" elevation={10} >
        <Toolbar>
          <Typography variant="h6" className={classes.title} align="center">
            {props.children}
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

export default Title;