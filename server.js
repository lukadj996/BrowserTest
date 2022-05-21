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
app.use(express.urlencoded({ extended: true }));
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
  res.set('WWW-Authenticate', 'Basic realm="401"') // change this
  if (req.headers.authorization !== 'Basic bHVrYTpjYXI=') {
    return res.status(401).send('Access denied. Please Authenticate') // Access denied.   
  }
  // Access granted...
  res.send('Hello Luka!')
  // or call next() if you use it as middleware (as snippet #1)
})

app.get("/status/408", (req, res) => {
  res.status(408).send("408 Request Timeout")
  // or call next() if you use it as middleware (as snippet #1)
})
app.post("/form",(req,res)=>{
  let {testinput,testinput2} = req.body
  res.send(`<h1>Form submitted!</h1><p style="font-size:1.2em">testinput: "${testinput}", testinput 2: "${testinput2}"</p>`)
})

// Start the server
const PORT = parseInt(process.env.PORT) || 80;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;