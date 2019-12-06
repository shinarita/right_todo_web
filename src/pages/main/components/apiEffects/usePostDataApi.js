import React, {
  useEffect,
  useReducer,
} from 'react';
import axios from 'axios';

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.data
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    default:
      throw new Error()
  }
}

const usePostDataApi = (payload, initialData) => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  })
  const { url, method = 'post', data } = payload
  let update = React.useRef(false)
  const triggerUpdate = () => {
    update.current = true
  }
  useEffect(() => {
    if (update.current) {
      const fetchData = async () => {
        dispatch({ type: 'FETCH_INIT' })
        try {
          let reqOption = {
            url,
            method,
            data
          }
          const result = await axios(reqOption)
          dispatch({ type: 'FETCH_SUCCESS', data: result.data })
        } catch (error) {
          dispatch({ type: 'FETCH_FAILURE' })
        }
      }
      fetchData()
    }
  }, [update.current])
  return [state, triggerUpdate]
}

export default usePostDataApi