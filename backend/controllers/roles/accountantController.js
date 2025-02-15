// controllers/roles/accountantController.js
const db = require('../../utils/db');

// Fetch invoice details
const getInvoiceDetails = async (req, res) => {
  const { clientName, startDate, endDate } = req.query;

  let query = `
    SELECT 
      s.salesid AS invoice_number,
      s.date AS invoice_date,
      c.clientid,
      c.name AS client_name,
      c.address AS client_address,
      c.email AS client_email,
      c.contact AS client_contact,
      s.salesmanname,
      s.qty AS quantity,
      s.amount AS total_amount,
      st.amount_paid,
      st.amount_remaining,
      CASE 
        WHEN st.amount_remaining = 0 THEN 'Paid'
        WHEN st.amount_paid = 0 THEN 'Unpaid'
        ELSE 'Partially Paid'
      END AS payment_status,
      c.paymentdetails
    FROM 
      sales s
    JOIN 
      clients c ON s.clientid = c.clientid
    JOIN 
      status st ON s.statusid = st.statusid
    WHERE 1=1
  `;

  const queryParams = [];

  if (clientName) {
    query += ` AND c.name ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${clientName}%`);
  }

  if (startDate) {
    query += ` AND s.date >= $${queryParams.length + 1}`;
    queryParams.push(startDate);
  }

  if (endDate) {
    query += ` AND s.date <= $${queryParams.length + 1}`;
    queryParams.push(endDate);
  }

  query += ' ORDER BY s.date DESC';

  try {
    const result = await db.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getInvoiceDetails};
/*
// controllers/roles/accountantController.js

// Generate Balance Sheet
const generateBalanceSheet = async (req, res) => {
    try {
      // Example query to get financial data for balance sheet
      const result = await db.query('SELECT * FROM balance_sheet_data'); 
      // Logic to generate the balance sheet based on the result
      res.status(200).json({ report: 'Balance Sheet Report', data: result.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Generate Income Statement
  const generateIncomeStatement = async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM income_statement_data');
      res.status(200).json({ report: 'Income Statement Report', data: result.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Generate Cash Flow Statement
  const generateCashFlowStatement = async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM cash_flow_data');
      res.status(200).json({ report: 'Cash Flow Statement Report', data: result.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = { generateBalanceSheet, generateIncomeStatement, generateCashFlowStatement };
  
// controllers/roles/accountantController.js

const generateARReport = async (req, res) => {
    try {
      const result = await db.query(`
        SELECT customer_id, SUM(amount_due) as total_due
        FROM invoices
        WHERE status = 'unpaid'
        GROUP BY customer_id
      `);
      res.status(200).json({ report: 'Accounts Receivables Report', data: result.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = { generateARReport };
  
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3();
  
  const searchExcelFile = async (req, res) => {
    const { searchTerm } = req.query;
    const params = {
      Bucket: 'your-bucket-name',
      Prefix: `reports/${searchTerm}`,  // Assuming files are stored under 'reports/'
    };
    
    try {
      const data = await s3.listObjectsV2(params).promise();
      const files = data.Contents.map(file => file.Key);
      res.status(200).json({ files });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = { searchExcelFile };

// controllers/roles/accountantController.js

const generateCustomReport = async (req, res) => {
    const { reportType, values } = req.body;  // Accept the type of report and custom values from the frontend
    try {
      // Process values and generate the report based on reportType
      // Example: reportType could be 'balance-sheet', 'income-statement', etc.
      res.status(200).json({ report: `${reportType} Report`, data: values });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = { generateCustomReport };
    
  */