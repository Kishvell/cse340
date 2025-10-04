/* ************************************
 *  Account Controller
 *  Unit 4/5, Account Management
 * ************************************ */
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 * Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
 * Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("./account/register", { title: "Registration", nav, errors: null })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered, ${account_firstname}. Please log in.`)
    return res.status(201).render("./account/login", { title: "Login", nav, errors: null })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("./account/register", { title: "Registration", nav, errors: null })
  }
}

/* ****************************************
 * Deliver Account Management View
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav()
  const accountData = req.accountData  // from JWT middleware
  let greeting = `Welcome ${accountData.account_firstname}`

  res.render("./account/account-management", {
    title: "Account Management",
    nav,
    greeting,
    accountData,
  })
}

/* ****************************************
 * Deliver Account Update View
 * *************************************** */
async function buildUpdateView(req, res, next) {
  const nav = await utilities.getNav()
  const accountId = req.params.account_id
  const accountData = await accountModel.getAccountById(accountId)

  res.render("./account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
  })
}

/* ****************************************
 * Process Account Update
 * *************************************** */
async function updateAccount(req, res, next) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  try {
    const result = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
    req.flash("notice", "Account information updated successfully.")
    const updatedAccount = await accountModel.getAccountById(account_id)
    res.render("./account/account-management", {
      title: "Account Management",
      nav,
      greeting: `Welcome ${updatedAccount.account_firstname}`,
      accountData: updatedAccount,
    })
  } catch (error) {
    req.flash("notice", "Error updating account information.")
    res.render("./account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: error }],
      accountData: req.body,
    })
  }
}

/* ****************************************
 * Process Password Change
 * *************************************** */
async function updatePassword(req, res, next) {
  const nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  try {
    const hashedPassword = await bcrypt.hashSync(account_password, 10)
    const result = await accountModel.updatePassword(hashedPassword, account_id)

    req.flash("notice", "Password updated successfully.")
    const updatedAccount = await accountModel.getAccountById(account_id)
    res.render("./account/account-management", {
      title: "Account Management",
      nav,
      greeting: `Welcome ${updatedAccount.account_firstname}`,
      accountData: updatedAccount,
    })
  } catch (error) {
    req.flash("notice", "Error updating password.")
    res.render("./account/update", {
      title: "Change Password",
      nav,
      errors: [{ msg: error }],
      accountData: req.body,
    })
  }
}

/* ****************************************
 * Logout process
 * *************************************** */
async function logout(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout
}
