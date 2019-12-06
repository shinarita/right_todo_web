import React, { useEffect, useState, useCallback } from 'react';
import {
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography,
  List, Badge, CircularProgress
} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TodoItem from './todoItem'
import { useGetDataApi } from '../apiEffects'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}))

const formatDate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const TodayDate = formatDate()

export default function Today({ history }) {
  const classes = useStyles()
  useEffect(() => {
    document.title = 'Today-RightTodo'
  }, [])
  const [update, setUpdate] = useState(false)
  const updateCallback = useCallback(() => {
    setUpdate(c => !c)
  }, [setUpdate])
  const [{ data, isLoading, isError }] = useGetDataApi(
    { url: `todo/list/${TodayDate}` },
    { date: '', completed: [], uncompleted: [] },
    [update]
  )
  const { completed, uncompleted } = data
  if (isLoading) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    )
  }
  if (isError) {
    return (
      <div className={classes.root}>
        <Typography>出错啦。。。。</Typography >
      </div>
    )
  }
  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          id='uncompleted_list'
        >
          <Badge color="primary" badgeContent={uncompleted.length}>
            <Typography className={classes.heading}>待完成</Typography>
          </Badge>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List className={classes.list}>
            {
              uncompleted.sort((a, b) => (b.priority - a.priority)).map((item, index) => {
                const { id, title, description, done, priority } = item
                return <TodoItem
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  index={index + 1}
                  onUpdateCb={updateCallback}
                  done={done}
                  history={history}
                  completed={false}
                  priority={priority}
                />
              })
            }
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          id='completed_list'
        >
          <Badge color="primary" badgeContent={completed.length}>
            <Typography className={classes.heading}>已完成</Typography>
          </Badge>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List className={classes.list}>
            {
              completed.map((item, index) => {
                const { id, title, description, done, priority } = item
                return <TodoItem
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  index={index + 1}
                  onUpdateCb={updateCallback}
                  done={done}
                  history={history}
                  completed
                  priority={priority}
                />
              })
            }
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}