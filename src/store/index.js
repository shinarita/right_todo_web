import React, { createContext, useContext, useReducer } from 'react'
import InitialState from './initialState'
import MainReducer from './reducers'

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

export const useStoreValue = () => useContext(StateContext)

export { InitialState, MainReducer }