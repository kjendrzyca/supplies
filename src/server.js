const path = require('path')
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-body')
const sendStatic = require('koa-send')
const router = require('koa-router')({
  prefix: '/api'
})

const globals = {
  isProduction: process.env.NODE_ENV === 'production'
}

let data = [
  {id: 1, name: 'mleko', quantity: 2},
  {id: 2, name: 'woda', quantity: 0}
]

const log = {
  error: (...args) => console.error(...args),
  info: (...args) => console.log(...args)
}
app.on('error', (error, ctx) => {
  log.error('server error', error, ctx)
})

router.get('/', async (ctx, next) => {
  ctx.status = 200
  ctx.body = data
  await next()
})

router.post('/', async (ctx, next) => {
  log.info('BODY', ctx.request.body)
  data = ctx.request.body
  ctx.status = 200
  await next()
})

app.use(bodyParser())
if (globals.isProduction) {
  const staticPath = path.join(__dirname, '..', 'build')

  log.info('serving static files', staticPath)

  app.use(async (ctx, next) => {
    if (ctx.path.includes('/api')) {
      return await next()
    }
    await sendStatic(ctx, ctx.path, {
      root: staticPath,
      index: 'index.html'
    })
  })
}

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3001)