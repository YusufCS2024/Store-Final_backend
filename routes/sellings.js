var express = require("express");
var router = express.Router();
const {
  totalSellings,
  todaysSellings,
  daySellings,
  thisMonthSellings,
  getMonthSellings,
  todaysInvoices,
  thisMonthInvoices,
  invoices,
  getInvoice,
  thisWeekInvoices,
  thisWeekSellings,
  thisYearSellings,
  thisYearInvoices,
  totalNet,
  totalSell,
  refundInvoice,
  refundItems,
} = require("../controllers/statistics");
const auth = require("../middlewares/protect");

// router.use(auth);

router.get("/profit", totalSellings);
router.get("/day", todaysSellings);
router.get("/invoices/all", invoices);
router.get("/invoices/today", todaysInvoices);
router.get("/invoices/invoice/:id", getInvoice);
router.get("/day/:date", daySellings);
router.get("/month", thisMonthSellings);
router.get("/week", thisWeekSellings);
router.get("/year", thisYearSellings);
router.get("/totalNet", totalNet);
router.get("/totalSell", totalSell);
router.get("/invoices/month", thisMonthInvoices);
router.get("/invoices/week", thisWeekInvoices);
router.get("/invoices/year", thisYearInvoices);
router.get("/month/:year/:month", getMonthSellings);
router.delete("/invoices/delete/:id", refundInvoice);
router.delete("/invoices/deleteItems/:id", refundItems);
module.exports = router;
