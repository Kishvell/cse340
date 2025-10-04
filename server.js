/* ******************************************
 * Primary Server File
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

/* ***********************
 * Middleware
 *************************/
// Sessions & Messages
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)
app.use(require("connect-flash")())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

// Body parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Cookie parsing (JWT)
app.use(cookieParser())

/* ***********************
 * JWT Middleware to attach accountData if logged in
 *************************/
app.use(async (req, res, next) => {
  res.locals.accountData = null
  const token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      res.locals.accountData = decoded
    } catch (err) {
      console.log("JWT verification failed:", err.message)
    }
  }
  next()
})

/* ***********************
 * View Engine and Layouts
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)

// Home
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes (protected via middleware inside inventoryRoute if needed)
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

/* ***********************
 * 404 - File Not Found
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message = err.status === 404
    ? err.message
    : "Oh no! There was a crash. Maybe try a different route?"
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Info
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})
