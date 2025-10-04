/* ************************************
 *  Account routes
 *  Unit 4/5, Account Management
 * ************************************ */
// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")
const jwtAuth = require("../utilities/jwt-middleware") // if you have a JWT auth middleware

/* ************************************
 *  Deliver Login View
 ************************************ */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ************************************
 *  Deliver Registration View
 ************************************ */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* ************************************
 *  Process Registration
 ************************************ */
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ************************************
 *  Process Login
 ************************************ */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ************************************
 * Account Management View
 * Protected route using JWT
 ************************************ */
router.get(
  "/",
  jwtAuth,
  utilities.handleErrors(accountController.buildAccountManagement)
)

/* ************************************
 * Deliver Account Update View
 ************************************ */
router.get(
  "/update/:account_id",
  jwtAuth,
  utilities.handleErrors(accountController.buildUpdateView)
)

/* ************************************
 * Process Account Update
 ************************************ */
router.post(
  "/update",
  jwtAuth,
  regValidate.validateAccountUpdate,
  utilities.handleErrors(accountController.updateAccount)
)

/* ************************************
 * Process Password Change
 ************************************ */
router.post(
  "/update-password",
  jwtAuth,
  regValidate.validatePasswordChange,
  utilities.handleErrors(accountController.updatePassword)
)

/* ************************************
 * Logout
 ************************************ */
router.get("/logout", utilities.handleErrors(accountController.logout))

module.exports = router
