import React, { FunctionComponent, useEffect } from "react";
import slugify from 'slugify';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './styles';
import { SwipeableDrawer, List, ListItem, ListItemText } from "@material-ui/core";

interface DrawerProps {
    drawer: boolean,
    toggleDrawer: any,
    toc: Array<any>
}

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }
const Drawer: FunctionComponent<DrawerProps> = (props: DrawerProps) => {
    const { drawer, toggleDrawer, toc } = props;
    const classes = useStyles();
    return (
        <SwipeableDrawer
            open={drawer}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
        >
            <div
                className={classes.list}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    {toc.map((elem, index) => (
                        <ListItemLink href={"#" +slugify(elem.title)}  key={elem.title}>
                            <ListItemText primary={elem.title} />
                        </ListItemLink>
                    ))}
                </List>
            </div>
        </SwipeableDrawer>
    )
}
export default Drawer;