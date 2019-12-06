import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import HistoryIcon from '@material-ui/icons/History';
import { Link as RouterLink } from 'react-router-dom';

const Menus = [
  { key: 'today', to: '/today', text: '今天', icon: <TodayIcon /> },
  { key: 'history', to: '/history', text: '历史', icon: <HistoryIcon /> },
]

function ListItemLink(props) {
  const { icon, text, to, pathname } = props
  const renderLink = React.useMemo(
    () => (
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} {...itemProps} ref={ref} />
      ))
    ),
    [to]
  )
  return (
    <li>
      <ListItem button component={renderLink} selected={pathname === to}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    </li>
  )
}
ListItemLink.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
};


export const MenuList = (props) => {
  const { location } = props
  return (
    <React.Fragment>
      {
        Menus.map(item => {
          const { key, to, text, icon } = item
          return (
            <ListItemLink
              key={key}
              to={to}
              text={text}
              icon={icon}
              pathname={location.pathname}
            />
          )
        })
      }
    </React.Fragment>
  )
}

const SecondaryMenus = [
  { key: 'add', to: '/add', text: '增加', icon: <AddCircleOutlineIcon /> }
]
export const SecondaryMenuList = props => {
  const { location } = props
  return (
    <React.Fragment>
      <ListSubheader inset>操作</ListSubheader>
      {
        SecondaryMenus.map(item => {
          const { key, to, text, icon } = item
          return (
            <ListItemLink
              key={key}
              to={to}
              text={text}
              icon={icon}
              pathname={location.pathname}
            />
          )
        })
      }
    </React.Fragment>
  )
}