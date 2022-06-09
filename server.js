import express, {
  static as static_express
} from 'express';
import {
  parseDomain
} from 'parse-domain';

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(luka_redirect)
}
process.env.TZ = "Europe/Belgrade"
app.use(static_express("./static"))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// console.log("############################# NODE_ENV", process.env.NODE_ENV)
function luka_redirect(req, res, next) {
  const subdomainParser = (function () {
    const parsedDomain = {}
    return {
      get: function (hostname) {
        // Cache, Touch
        if (parsedDomain[hostname] === undefined) {
          try {
            const ps = parseDomain(hostname)
            parsedDomain[hostname] = [ps.subDomains.join('.'), ps.domain + '.' + ps.topLevelDomains.join('.')]
          } catch (e) {
            parsedDomain[hostname] = [null, null]
          }
        }
        return parsedDomain[hostname]
      }
    }
  }())
  const domain = subdomainParser.get(req.hostname)
  let redirectTo = null

  // console.log("############################# domain", domain)
  if (domain[0] === 'www.test') {
    redirectTo = `https://test.${domain[1]}${req.url}`
  }

  if (redirectTo !== null) {
    res.redirect(301, redirectTo)
    return
  }

  return next()
}

app.get("/status/401", (req, res) => {
  res.set('WWW-Authenticate', 'Basic realm="this_is_realm"') // change this
  if (req.headers.authorization !== 'Basic bHVrYTpjYXI=') {
    return res.status(401).send('<p style="font-size:2em">Access denied. Please Authenticate</p>') // Access denied.   
  }
  // Access granted...
  res.send('<p style="font-size:2em">Hello Luka!</p>')
  // or call next() if you use it as middleware (as snippet #1)
})

app.get("/status/408", (req, res) => {
  res.status(408).send('<p style="font-size:2em">408 Request Timeout</p>')
  // or call next() if you use it as middleware (as snippet #1)
})
app.get("/status/415", (req, res) => {
  res.status(415).send('<p style="font-size:2em">415 Unsupported Media Type</p>')
  // or call next() if you use it as middleware (as snippet #1)
})
app.post("/form", (req, res) => {
  let {
    testinput,
    testinput2,
    pass,
    number
  } = req.body
  res.send(`<h1>Form submitted!</h1><p style="font-size:2em">testinput: "${testinput}", testinput 2: "${testinput2}", number: "${number}", password: "${pass}"</p>`)
})
app.get("/set_cookie", (req, res) => {
  let cookie_exist = false;
  if (req.headers.cookie) {
    cookie_exist = req.headers.cookie.split("; ").includes("serversidehttponly=qwerty123")
  }
  if (cookie_exist) {
    res.send(`<p style="font-size:2em">Cookie is set successfully! ${req.headers.cookie}</p>`)
  } else {
    res.setHeader("set-cookie", "serversidehttponly=qwerty123; httpOnly=true")
    res.send(`<p style="font-size:2em">Http only cookie is not set. <br>Tried to set http Only cookie, please refresh!</p>`)
  }
})

app.get("/clear_cookies", (req, res) => {
  if (req.headers.cookie) {
    res.setHeader("Clear-Site-Data", '"cookies"')
    res.send(`<p style="font-size:2em">Cookie recieved: ${req.headers.cookie} <br> please refresh to see if cookies are cleared!</p>`)
  } else {
    res.send(`<p style="font-size:2em">No cookies recieved!</p>`)
  }
})

// Start the server
const PORT = parseInt(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;