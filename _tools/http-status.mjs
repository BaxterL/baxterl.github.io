import http from 'node:http'

export const statusOf = (url) =>
  new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      res.resume()
      resolve(res.statusCode ?? 0)
    })
    req.on('error', reject)
    req.setTimeout(8000, () => req.destroy(new Error('timeout')))
  })
