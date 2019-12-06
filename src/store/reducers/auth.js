const auth = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        authed: true
      }
    case 'LOGOUT':
      return {
        ...state,
        authed: false
      }
    default:
      throw new Error()
  }
}

export default auth