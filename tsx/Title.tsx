import React, { FunctionComponent, useEffect } from "react";
import slugify from 'slugify';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './styles';

interface TitleProps {
  children: string,
  isMobile: boolean
}


const Title: FunctionComponent<TitleProps> = (props: TitleProps) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div id={slugify(props.children)} className={classes.anchor} />
      <Typography variant={props.isMobile ? "h5" : "h3"} className={classes.title} align="center">
        {props.children}
      </Typography>
    </React.Fragment>
  )
}

export default Title;