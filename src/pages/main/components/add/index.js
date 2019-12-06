import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper, Grid, Slider, FormControl, Input, RadioGroup, FormControlLabel, Radio, ListItemText,
  Switch, Button, FormLabel, FormHelperText, Checkbox, FormGroup, Select, MenuItem
} from '@material-ui/core/';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { format, addDays } from 'date-fns'
import zhLocale from 'date-fns/locale/zh-CN'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { postRequest } from '../../../../middlewares/request'

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .required('Required'),
  onlyToday: Yup.boolean(),
  startDate: Yup.date().notRequired(),
  endDate: Yup.date().notRequired().min(Yup.ref('startDate'), '结束日期需在开始日期之后。')
});

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: '600px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2)
  },
  margin: {
    height: theme.spacing(3),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  formControl: {
    marginBottom: theme.spacing(2)
  },
  input: {
    width: '100%'
  },
  select: {
    width: '100%'
  }
}))

const marks = (function () {
  return Array.from({ length: 3 }).map((value, index) => {
    return {
      value: index + 1,
      label: index + 1
    }
  })
})();

const Today = format(new Date(), 'yyyy-MM-dd')
const initialValues = {
  title: '',
  description: '',
  priority: 1,
  onlyToday: true,
  endDate: format(addDays(new Date, 1), 'yyyy-MM-dd'),
  startDate: Today,
  type: 'day',
  dates: []
}
const WeekDays = [
  { label: '星期一', value: 1 },
  { label: '星期二', value: 2 },
  { label: '星期三', value: 3 },
  { label: '星期四', value: 4 },
  { label: '星期五', value: 5 },
  { label: '星期六', value: 6 },
  { label: '星期日', value: 0 },
]

const MonthDays = (function () {
  const days = Array.from({ length: 30 }).map((v, i) => i + 1)
  return days
})()

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Add({ history }) {
  const classes = useStyles()
  useEffect(() => {
    document.title = 'Add-RightTodo'
  }, [])
  const [submitCompleted, setSubmitCompleted] = React.useState(false)
  const handleSubmit = (values, formikBag) => {
    formikBag.setSubmitting(true)
    const { onlyToday, title, description, priority, endDate, startDate, type, dates } = values
    let todoItem = {
      user: localStorage.getItem('user'),
      title,
      description,
      priority,
      startDate: onlyToday ? Today : startDate,
      endDate: onlyToday ? Today : endDate,
      type,
      dates
    }
    postRequest('todo/item', todoItem)
      .then(res => {
        setSubmitCompleted(true)
        history.push('/today')
      })
      .catch(err => {
        setSubmitCompleted(true)
      })
      .finally(() => {
        formikBag.setSubmitting(false)
        setSubmitCompleted(true)
      })
  }

  return (
    <Paper className={classes.paper}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={FormSchema}
      >
        {
          props => {
            const { values, touched, errors, dirty, isSubmitting, handleChange, handleBlur, handleSubmit,
              handleReset, setFieldValue
            } = props
            const titleError = errors.title && touched.title
            const descError = errors.description && touched.description
            const endDateError = errors.endDate && touched.endDate
            const handleCheckboxChange = e => {
              const value = parseInt(e.target.value)
              let dates = new Set(values.dates)
              if (dates.has(value)) {
                dates.delete(value)
              } else {
                dates.add(value)
              }
              setFieldValue('dates', Array.from(dates))
            }
            const handleChangeType = (e) => {
              setFieldValue('dates', [])
              setFieldValue('type', e.target.value)
            }
            return (
              <form onSubmit={handleSubmit} noValidate>
                <FormControl fullWidth required error={titleError} className={classes.formControl}>
                  <Grid container alignItems='center'>
                    <Grid item xs={12} sm={2}>
                      <FormLabel htmlFor='title' filled>标题</FormLabel >
                    </Grid>
                    <Grid item xs={12} sm={10}>
                      <Input id='title' value={values.title} onChange={handleChange} className={classes.input} />
                      <FormHelperText>{titleError && errors.title}</FormHelperText>
                    </Grid>
                  </Grid>
                </FormControl>
                <FormControl fullWidth className={classes.formControl} error={descError}>
                  <Grid container alignItems='center'>
                    <Grid item xs={12} sm={2}>
                      <FormLabel htmlFor='description'>描述</FormLabel >
                    </Grid>
                    <Grid item xs={12} sm={10}>
                      <Input id='description' value={values.description} onChange={handleChange} className={classes.input} />
                      <FormHelperText>{descError && errors.description}</FormHelperText>
                    </Grid>
                  </Grid>
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                  <Grid container alignItems='flex-start'>
                    <Grid item xs={12} sm={2}>
                      <FormLabel htmlFor='priorty'>优先级</FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                      <Slider
                        defaultValue={values.priority}
                        value={values.priority}
                        onChange={(e, value) => setFieldValue('priority', value)}
                        step={1}
                        valueLabelDisplay='auto'
                        marks={marks}
                        min={1}
                        max={3}
                      />
                      <FormHelperText></FormHelperText>
                    </Grid>
                  </Grid>
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                  <Grid container alignItems='baseline'>
                    <Grid item xs={12} sm={2}>
                      <FormLabel htmlFor='onlyToday'>仅今天</FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                      <Switch
                        id='onlyToday'
                        edge='start'
                        onChange={(e) => setFieldValue('onlyToday', e.target.checked)}
                        checked={values.onlyToday}
                      />
                      <FormHelperText></FormHelperText>
                    </Grid>
                  </Grid>
                </FormControl>
                {
                  !values.onlyToday && (
                    <React.Fragment>
                      <FormControl fullWidth className={classes.formControl} error={endDateError}>
                        <Grid container alignItems='center' >
                          <Grid item xs={12} sm={2}>
                            <FormLabel htmlFor='startDate'>开始日期</FormLabel>
                          </Grid>
                          <Grid item xs={12} sm={10}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhLocale}>
                              <DatePicker
                                disableToolbar
                                variant='inline'
                                format='yyyy-MM-dd'
                                margin='normal'
                                id='date-picker'
                                value={values.startDate}
                                onChange={(date) => setFieldValue('startDate', format(date, 'yyyy-MM-dd'))}
                                autoOk
                                disablePast
                                showTodayButton
                              />
                            </MuiPickersUtilsProvider>
                            <FormHelperText>{endDateError && errors.startDate}</FormHelperText>
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl fullWidth className={classes.formControl} error={endDateError}>
                        <Grid container alignItems='center' >
                          <Grid item xs={12} sm={2}>
                            <FormLabel htmlFor='endDate'>结束日期</FormLabel>
                          </Grid>
                          <Grid item xs={12} sm={10}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhLocale}>
                              <DatePicker
                                disableToolbar
                                variant='inline'
                                format='yyyy-MM-dd'
                                margin='normal'
                                id='date-picker'
                                value={values.endDate}
                                onChange={(date) => setFieldValue('endDate', format(date, 'yyyy-MM-dd'))}
                                autoOk
                                disablePast
                              />
                            </MuiPickersUtilsProvider>
                            <FormHelperText>{endDateError && errors.endDate}</FormHelperText>
                          </Grid>
                        </Grid>
                      </FormControl>
                      <FormControl fullWidth className={classes.formControl} error={endDateError}>
                        <Grid container alignItems='baseline' >
                          <Grid item xs={12} sm={2}>
                            <FormLabel htmlFor='endDate'>类型</FormLabel>
                          </Grid>
                          <Grid item xs={12} sm={10}>
                            <RadioGroup name='type' value={values.type} onChange={handleChangeType} row>
                              <FormControlLabel value='day' control={<Radio />} label='每天' />
                              <FormControlLabel value='week' control={<Radio />} label='每周' />
                              <FormControlLabel value='month' control={<Radio />} label='每月' />
                            </RadioGroup>
                            <FormHelperText>{endDateError && errors.endDate}</FormHelperText>
                          </Grid>
                        </Grid>
                      </FormControl>
                      {
                        values.type === 'week'
                          ? (
                            <FormControl fullWidth className={classes.formControl} error={endDateError}>
                              <Grid container alignItems='baseline' >
                                <Grid item xs={12} sm={2}>
                                  <FormLabel htmlFor='dates'>日期设定</FormLabel>
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                  <FormGroup row>
                                    {
                                      WeekDays.map(item => {
                                        const { value, label } = item
                                        return (
                                          <FormControlLabel
                                            key={value}
                                            control={<Checkbox checked={values.dates.indexOf(value) > -1} onChange={handleCheckboxChange} value={value} />}
                                            label={label}
                                          />)
                                      })
                                    }
                                  </FormGroup>
                                  <FormHelperText>{endDateError && errors.dates}</FormHelperText>
                                </Grid>
                              </Grid>
                            </FormControl>
                          )
                          : null
                      }
                      {
                        values.type === 'month'
                          ? (
                            <FormControl fullWidth className={classes.formControl} error={endDateError}>
                              <Grid container alignItems='baseline' >
                                <Grid item xs={12} sm={2}>
                                  <FormLabel htmlFor='dates'>日期设定</FormLabel>
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                  <Select
                                    multiple
                                    value={values.dates}
                                    onChange={e => setFieldValue('dates', e.target.value)}
                                    renderValue={selected => selected.sort((a, b) => (a - b)).join(', ')}
                                    MenuProps={MenuProps}
                                    className={classes.select}
                                  >
                                    {
                                      MonthDays.map(item => (
                                        <MenuItem key={item} value={item}>
                                          <Checkbox checked={values.dates.indexOf(item) > -1} />
                                          <ListItemText primary={item} />
                                        </MenuItem>
                                      ))
                                    }
                                  </Select>
                                  <FormHelperText>{endDateError && errors.dates}</FormHelperText>
                                </Grid>
                              </Grid>
                            </FormControl>
                          )
                          : null
                      }
                    </React.Fragment>
                  )
                }
                {/* <Grid item xs={12} > */}
                <Button type='submit' disabled={isSubmitting} variant='contained' color="primary" className={classes.button}>
                  确定
                </Button>
                <Button variant='contained' className={classes.button} onClick={handleReset}>
                  取消
                </Button>
                {/* </Grid> */}
              </form>
            )
          }
        }
      </Formik>
    </Paper>
  )
}