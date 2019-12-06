import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useState, useMemo } from 'react';
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import {
  Paper, CardContent, Grid, Typography, Card, ListItem, ListItemIcon, ListItemText
} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import zhLocale from '@fullcalendar/core/locales/zh-cn'
import { format } from 'date-fns'
import { useGetDataApi } from '../apiEffects'

const useStyles = makeStyles(
  theme => ({
    paper: {
      padding: theme.spacing(2)
    },
    todoList: {
      marginTop: theme.spacing(2)
    },
    todoItemIndex: {
      marginRight: theme.spacing(2)
    }
  })
)

export default function History() {
  const classes = useStyles()

  useEffect(() => {
    document.title = 'History-RightTodo'
  }, [])

  const [selectedDate, setSelectedDate] = useState('')

  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))

  const [{ data, isLoading }] = useGetDataApi(
    { url: `/todo/history/list/${selectedMonth}` },
    {},
    [selectedMonth]
  )

  const events = useMemo(() => {
    let array = []
    Object.keys(data).forEach(key => {
      const completedCount = data[key]['completed']['length']
      const uncompletedCount = data[key]['uncompleted']['length']
      completedCount && array.push({ date: key, title: `已完成：${completedCount}`, count: completedCount })
      uncompletedCount && array.push({ date: key, title: `未完成：${uncompletedCount}`, count: uncompletedCount })
    })
    return array
  }, [isLoading])

  function handleDateClick(info) {
    const date = info.dateStr;
    setSelectedDate(date)
  }

  function getMonth(time) {
    setSelectedMonth(`${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, '0')}`)
  }

  function renderTodoList() {
    if (!data[selectedDate]) {
      return null
    }
    const { completed, uncompleted } = data[selectedDate]
    return (
      <React.Fragment>
        <Grid item xs={12} sm={5}>
          <Card>
            <CardContent>
              <Typography variant='h5' component='h2' gutterBottom >
                已完成：
              </Typography>
              {
                completed.length
                  ? completed.map((item, index) => {
                    return (
                      <ListItem alignItems='flex-start' key={item._id}>
                        <ListItemIcon>
                          <Typography component='span' variant='subtitle2'>{index + 1}</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={item.description}
                        />
                      </ListItem>
                      // <Typography key={item._id} gutterBottom display='inline' >
                      //   <Typography component='span' variant='subtitle2' className={classes.todoItemIndex}>{index + 1}</Typography>
                      //   <Typography component='span' variant='body2'>{item.title}</Typography>
                      // </Typography>
                    )
                  })
                  : (<Typography variant='subtitle2' component='span' gutterBottom >
                    一个都没有完成哦
                  </Typography>)
              }
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card>
            <CardContent>
              <Typography variant='h5' component='h3' gutterBottom >
                未完成：
              </Typography>
              {
                uncompleted.length
                  ? uncompleted.map((item, index) => {
                    return (
                      <ListItem alignItems='flex-start' key={item._id}>
                        <ListItemIcon>
                          <Typography component='span' variant='subtitle2'>{index + 1}</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={item.description}
                        />
                      </ListItem>
                      // <Typography key={item._id} gutterBottom display='inline' >
                      //   <Typography component='span' variant='subtitle2' className={classes.todoItemIndex}>{index + 1}</Typography>
                      //   <Typography component='span' variant='body2'>{item.title}</Typography>
                      // </Typography>
                    )
                  })
                  : (<Typography variant='subtitle2' component='span' gutterBottom >
                    全部都完成了，棒棒哒
                  </Typography>)
              }
            </CardContent>
          </Card>
        </Grid>
      </React.Fragment>
    )
  }

  return (
    <Paper className={classes.paper}>
      <FullCalendar
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={zhLocale}
        events={events}
        // eventRender={info => { info.el.style = { width: '50%' } }}
        eventBackgroundColor='#fff'
        eventBorderColor='#fff'
        eventTextColor='#aaa'
        selectable
        dateClick={handleDateClick}
        height={500}
        datesRender={({ view }) => { getMonth(view.currentStart) }}

      />
      <Grid container className={classes.todoList} justify='space-between'>
        {renderTodoList()}
      </Grid>
    </Paper>
  )
}