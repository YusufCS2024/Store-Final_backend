const { Invoice } = require("../models/Invoice");
const { Product } = require("../models/Product");
async function totalSellings(req, res) {
  try {
    let profit = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$totalPrice" },
        },
      },
    ]);
    return res.status(200).json(profit);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function todaysInvoices(req, res) {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    let invoices = await Invoice.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function todaysSellings(req, res) {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    let profit = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$totalPrice" },
        },
      },
    ]);
    return res.status(200).json(profit);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}
async function daySellings(req, res) {
  try {
    const request = new Date(req.params.date);
    const today = new Date(request);
    console.log(today);
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    let profit = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$totalPrice" },
        },
      },
    ]);
    return res.status(200).json(profit);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}
async function thisMonthSellings(req, res) {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Calculate the start and end dates for the entire month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1); // Month is zero-indexed in JavaScript Date objects
    const endOfMonth = new Date(currentYear, currentMonth, 0); // Get the last day of the month

    let profit = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$totalPrice" },
        },
      },
    ]);

    return res.status(200).json(profit);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function thisMonthInvoices(req, res) {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Calculate the start and end dates for the entire month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1); // Month is zero-indexed in JavaScript Date objects
    const endOfMonth = new Date(currentYear, currentMonth, 0); // Get the last day of the month

    let invoices = await Invoice.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}
async function invoices(req, res) {
  try {
    let invoices = await Invoice.find();
    if (!invoices) {
      return res.status(404).json("no invoices found");
    }
    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getMonthSellings(req, res) {
  try {
    const today = new Date();
    const currentMonth = req.params.month;
    const currentYear = req.params.year;

    // Calculate the start and end dates for the entire month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1); // Month is zero-indexed in JavaScript Date objects
    const endOfMonth = new Date(currentYear, currentMonth, 0); // Get the last day of the month
    // console.log(startOfMonth);
    // console.log(endOfMonth);

    let profit = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$totalPrice" },
        },
      },
    ]);

    return res.status(200).json(profit);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getInvoice(req, res) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json("INTERNAL SERVER ERROR");
    const formattedData = {
      ...invoice._doc,
      createdAt: invoice.createdAt.toLocaleString("en-US", {
        timeZone: "UTC", // Adjust timezone as needed
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    };
    const modifiedInvoice = { ...invoice };
    modifiedInvoice._doc.date = formattedData.createdAt;
    return res.status(200).json(modifiedInvoice._doc);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function thisWeekInvoices(req, res) {
  try {
    const today = new Date();
    const currentDay = today.getDay(); // Get the current day of the week (0 is Sunday, 6 is Saturday)
    const firstDayOfWeek = new Date(today); // Clone today's date

    // Calculate the start of the week based on the current day
    firstDayOfWeek.setDate(today.getDate() - currentDay);

    // Calculate the end of the week by adding 6 days to the start
    const endOfWeek = new Date(firstDayOfWeek);
    endOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    // Assuming createdAt field in invoices is a date field
    let invoices = await Invoice.find({
      createdAt: { $gte: firstDayOfWeek, $lte: endOfWeek },
    });

    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function thisWeekSellings(req, res) {
  try {
    const today = new Date();
    const currentDay = today.getDay(); // Get the current day of the week (0 is Sunday, 6 is Saturday)
    const firstDayOfWeek = new Date(today); // Clone today's date

    // Calculate the start of the week based on the current day
    firstDayOfWeek.setDate(today.getDate() - currentDay);

    // Calculate the end of the week by adding 6 days to the start
    const endOfWeek = new Date(firstDayOfWeek);
    endOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    let profit = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: firstDayOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$totalPrice" },
        },
      },
    ]);

    return res.status(200).json(profit);
  } catch (error) {
    console.error(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function thisYearSellings(req, res) {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Calculate the start and end dates for the entire year
    const startOfYear = new Date(currentYear, 0, 1); // January 1st of the current year
    const endOfYear = new Date(currentYear, 11, 31); // December 31st of the current year

    let profit = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$totalPrice" },
        },
      },
    ]);

    return res.status(200).json(profit);
  } catch (error) {
    console.error(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function thisYearInvoices(req, res) {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Calculate the start and end dates for the entire year
    const startOfYear = new Date(currentYear, 0, 1); // January 1st of the current year
    const endOfYear = new Date(currentYear, 11, 31); // December 31st of the current year

    let invoices = await Invoice.find({
      createdAt: { $gte: startOfYear, $lte: endOfYear },
    });
    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function totalNet(req, res) {
  try {
    const total = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ["$netPrice", "$stock"] },
          },
        },
      },
    ]);
    if (!total) {
      return res.status(404).json("INTERNAL SERVER ERROR");
    }
    return res.status(200).json(total);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function totalSell(req, res) {
  try {
    const total = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ["$sellPrice", "$stock"] },
          },
        },
      },
    ]);
    if (!total) {
      return res.status(404).json("INTERNAL SERVER ERROR");
    }
    return res.status(200).json(total);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function refundInvoice(req, res) {
  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json("Invoice not found");
    }
    //console.log(invoice);
    let products = invoice.products;
    for (product of products) {
      let updateProduct = await Product.findById(product._id);
      if (!updateProduct) {
        continue; //
      }
      updateProduct.stock += product.quantity;
      await updateProduct.save();
    }
    await Invoice.findByIdAndDelete(req.params.id);
    return res.status(200).json(invoice);
    //return res.status(200).json("Refund successful");
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function refundItems(req, res) {
  try {
    // Find the old and new invoices
    const oldInvoice = await Invoice.findById(req.params.id);
    const newInvoice = req.body.invoice;

    if (!oldInvoice) {
      return res.status(404).json("Invoice not found");
    }

    // Iterate through products to update stock quantity
    for (const newProduct of newInvoice.products) {
      const oldProduct = oldInvoice.products.find(
        (p) => p._id.toString() === newProduct._id
      );

      if (oldProduct) {
        // Calculate the difference in quantity after refund
        const quantityDifference = oldProduct.quantity - newProduct.quantity;

        // Update the stock quantity
        await Product.findByIdAndUpdate(newProduct._id, {
          $inc: { stock: quantityDifference },
        });
      }
    }

    // Update the entire invoice
    Object.assign(oldInvoice, newInvoice);
    await oldInvoice.save();

    return res.status(200).json("Refund successful");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
}


module.exports = {
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
};
