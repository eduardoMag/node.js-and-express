var express = require('express');
var fortune =require('./lib/fortune.js');
var app = express();

//handlebars view engine
var handlebars = require('express3-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: (name, options)=>{
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

//static middleware
app.use(express.static(__dirname + '/public'));

//set 'show tests' context property
app.use( (req, res, next)=>{
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

//WEATHER FUNCTION
function getWeatherData(){
  return{
    locations:[
      {
        name: 'Portland',
        forcastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)',
      },
      {
        name: 'Bend',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Partly Cloudy',
        temp: '55.0 F (12.8 C)',
      },
      {
        name: 'Manzanita',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
        weather: 'Light Rain',
        temp: '55.0 F (12.8 C)',
      },
    ],
  };
}
//MIDDLEWARE FOR WEATHER WIDGET
app.use( (req, res, next)=>{
  if(!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weather = getWeatherData();
  next();
});

//routes for templates
app.get('/', (req, res)=>{
  res.render('home');
});

app.get('/about', (req, res)=>{
  res.render('about',{
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js' } );
});

app.get('/tours/hood-river', (req, res)=>{
  res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', (req, res)=>{
  res.render('tours/request-group-rate');
});
app.get('/jquery-test', (req, res)=>{
  res.render('jquery-test');
});
app.get('/nursery-rhyme', (req, res)=>{
  res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', (req, res)=>{
  res.json({
    animal: 'squirrel',
    bodyPart: 'tail',
    adjective: 'bushy',
    noun: 'heck',
  });
});
//404 catch-all handler (middleware)
app.use((req, res)=>{
  res.status(404);
  res.render('404');
});
//500 error handler (middleware)
app.use((req, res, next)=>{
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), ()=>{
  console.log('Express started on http://localhost:' + app.get('port')+'; press Ctrl-C to terminate');
});
