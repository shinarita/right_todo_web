import {
  useEffect,
  useReducer,
} from 'react';
import { getRequest } from '../../../../middlewares/request'

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

const useGetDataApi = (payload, initialData, deps = []) => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  })
  const { url } = payload
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' })
      try {
        const result = await getRequest(url)
        dispatch({ type: 'FETCH_SUCCESS', data: result.data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE' })
      }
    }
    fetchData()
  }, [url, ...deps])
  return [state]
}

export default useGetDataApi