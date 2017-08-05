const options = {
    'content-type': 'application/json'
}

export default {
    getAll: () => fetch('/api', {
        ...options,
        method: 'GET'
    }),
    update: data => fetch('/api', {
        ...options,
        method: 'POST',
        body: data
    })
}