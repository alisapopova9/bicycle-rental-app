const koa = require('koa');
const koaLogger = require('koa-logger');
const koaStatic = require('koa-static');
const koaViews = require('koa-views');
const koaBody = require('koa-body');
const path = require('path');
const session = require('koa-session');

const templateRoutes = require('./server/templateRoutes');
const apiRoutes = require('./server/apiRoutes');

const views = koaViews(path.join(__dirname, './front/templates'), {
  map: { html: 'mustache' },
  options: {
    partials: {
      header: 'header',
      footer: 'footer'
    }
  }
});

const app = new koa();

app.keys = ['some secret hurr'];

app.use(koaLogger());
app.use(koaStatic('./front'));
app.use(session({ key: 'sid' }, app));

app.use(views);
app.use(koaBody());
app.use(templateRoutes);
app.use(apiRoutes);

app.listen(3000);
