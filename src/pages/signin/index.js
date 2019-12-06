import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CssBaseline, Paper, Avatar, Typography, TextField,
  Button, Box, Grid
  // FormControlLabel, Checkbox,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Copyright } from '../../components';
import {
  Formik
} from 'formik';
import axios from 'axios'
import * as Yup from 'yup';
import { useStoreValue } from '../../store'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgourndRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const FormSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required')
})

export default function Signin({ history }) {
  const [{}, dispatch] = useStoreValue()
  const classes = useStyles();
  useEffect(() => {
    document.title = 'Signin-RightTodo'
  }, [])
  const handleSubmit = (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true)
    const { username, password } = values
    axios.post('/api/auth/login', { username, password })
      .then(res => {
        if (res.headers) {
          const token = res.headers['x-auth-token']
          localStorage.setItem('token', token)
          localStorage.setItem('user', res.data.id)
          dispatch({ type: 'LOGIN' })
        }
        history.push('/today')
      })
      .catch(err => {
        setFieldError('password', '请输入正确的用户名和密码。')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }
  return (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            登录
          </Typography>
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={handleSubmit}
            validationSchema={FormSchema}
          >
            {
              props => {
                const { values, touched, errors, isSubmitting, handleChange, handleSubmit
                } = props
                const nameError = errors.username && touched.username
                const pwdError = errors.password && touched.password
                return (
                  <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <TextField
                      variant='outlined'
                      margin='normal'
                      required
                      fullWidth
                      id='username'
                      label='用户名'
                      name='username'
                      autoComplete='username'
                      autoFocus
                      onChange={handleChange}
                      value={values.username}
                      error={nameError}
                      helperText={nameError && errors.username}
                    />
                    <TextField
                      variant='outlined'
                      margin='normal'
                      required
                      fullWidth
                      name='password'
                      label='密码'
                      type='password'
                      id='password'
                      autoComplete='current-password'
                      onChange={handleChange}
                      value={values.password}
                      error={pwdError}
                      helperText={(errors.password && touched.password) && errors.password}
                    />
                    {/* <FormControlLabel
                      control={<Checkbox value='remember' color='primary' />}
                      label='记住我'
                    /> */}
                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      color='primary'
                      className={classes.submit}
                      disabled={isSubmitting}
                    >
                      登录
                    </Button>
                    {/* <Grid container>
                      <Grid item xs>
                        <Link href='#' variant='body2'>
                          忘记密码？
                        </Link>
                      </Grid>
                    </Grid> */}
                    <Box mt={5}>
                      <Copyright />
                    </Box>
                  </form>
                )
              }
            }
          </Formik>
        </div>
      </Grid>
    </Grid>
  )
}