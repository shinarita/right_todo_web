import React, { useCallback, useState } from 'react';
import {
  ListItem, ListItemIcon, ListItemText, Switch, ListItemSecondaryAction,
  IconButton
} from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { makeStyles } from '@material-ui/core/styles';
import { putRequest, deleteRequest } from '../../../../middlewares/request'
import { format } from 'date-fns'

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(1),
  },
  priority1: {
    color: theme.palette.error.light
  },
  priority2: {
    color: theme.palette.error.main
  },
  priority3: {
    color: theme.palette.error.dark
  },
  done: {
    color: theme.palette.success
  }
}));

export default function TodoItem(props) {
  const classes = useStyles()
  const { title, description, priority, id, done, onUpdateCb, history, completed } = props
  const [checked, setChecked] = useState(done)
  const handleSwitch = useCallback(() => {
    const done = !checked
    setChecked(done)
    let update = { done, date: done ? format(new Date(), 'yyyy-MM-dd') : '' }
    putRequest(`todo/item/${id}`, update)
    onUpdateCb()
  }, [checked])
  const handleDelete = useCallback(() => {
    deleteRequest(`todo/item/${id}`, { done: !checked })
    onUpdateCb()
  })
  const handleEdit = function () {
    history.push(`/edit/${id}`)
  }
  return (
    <ListItem alignItems='center' >
      <ListItemIcon>
        {completed ? <CheckCircleIcon className={classes.done} /> : <ErrorOutlineIcon className={classes[`priority${priority}`]} />}
      </ListItemIcon>
      <ListItemText
        primary={title}
        secondary={description}
      />
      {
        !completed && <ListItemSecondaryAction>
          <Switch
            edge='end'
            onChange={() => { handleSwitch() }}
            checked={checked}
          />
          <IconButton className={classes.button} aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton className={classes.button} aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      }
    </ListItem>
  )
}