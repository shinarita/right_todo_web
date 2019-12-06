import authReducer from './auth'

const mainRducer = ({ auth }, action) => ({
  auth: authReducer(auth, action)
})

export default mainRducer