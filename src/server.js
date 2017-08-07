const path = require('path')
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-body')
const sendStatic = require('koa-send')
const router = require('koa-router')({
  prefix: '/api',
})
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const DataSchema = require('./db').dataSchema

const globals = {
  dbConnectionString: process.env.DATABASE,
  isProduction: process.env.NODE_ENV === 'production',
}

const log = {
  error: (...args) => console.error(...args),
  info: (...args) => console.log(...args),
}

mongoose.connect(globals.dbConnectionString, () => {
  if (globals.isProduction) {
    return
  }
  mongoose.connection.db.dropDatabase()
})
const Data = mongoose.model('Data', DataSchema)
mongoose.connection.on(
  'error',
  console.error.bind(console, 'connection error:'),
)
mongoose.connection.once('open', function() {
  log.info('connected!')
})

app.on('error', (error, ctx) => {
  log.error('server error', error, ctx)
})

router.get('/', async (ctx, next) => {
  const dataFromDb = await Data.find()
  ctx.status = 200
  ctx.body = dataFromDb.length ? JSON.parse(dataFromDb[0].data) : []
  await next()
})

router.post('/', async (ctx, next) => {
  log.info('BODY', ctx.request.body)

  const allDataFromDb = await Data.find()

  if (allDataFromDb.length) {
    const dataFromDb = allDataFromDb[0]
    dataFromDb.data = JSON.stringify(ctx.request.body)
    await dataFromDb.save()
    ctx.status = 204
  } else {
    const created = new Data({
      data: JSON.stringify(ctx.request.body),
    })

    await created.save()
    ctx.status = 201
  }

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
      index: 'index.html',
    })
  })
}

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3001)
