import { useEffect, useState } from 'react'

let cache = null
let pending = null

export function useSiteData() {
  const [data, setData] = useState(cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache) {
      setData(cache)
      return
    }
    if (!pending) {
      pending = fetch('/data.json').then((res) => {
        if (!res.ok) throw new Error('Failed to load data.json')
        return res.json()
      })
    }
    pending
      .then((json) => {
        cache = json
        setData(json)
      })
      .catch((err) => setError(err))
  }, [])

  return { data, error }
}
