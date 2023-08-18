const express = require('express');
const cors = require('cors');
require('./services/db');
const importDataApi = require('./services/importDataApi');
const app = express()
const port = 3000;

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
}));

/**
 * Welcome URL
 */
app.get('/', (req, res) => {
  res.send('Welcome to the company api created for Kabolt !')
})

/**
 * Get the total number of companies
 */
app.get('/companies/count', async (req, res) => {
  try {
    const totalCount = await knex('companies').count('* as count');
    const count = totalCount[0].count;

    res.json(count);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred when retrieving the total number of companies.' });
  }
});

/**
 * Get all companies
 * Handle pagination
 * Filter by name
 */
app.get('/companies', async (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const itemsPerPage = 5;
  const offset = (currentPage - 1) * itemsPerPage;
  const nameFilter = req.query.name || '';

  try {
    const companies = await knex('companies')
      .where('name', 'like', `%${nameFilter}%`)
      .offset(offset)
      .limit(itemsPerPage);

    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred when retrieving the companies.' });
  }
});

/**
 * Get company by ID
 */
app.get('/companies/:id', async (req, res) => {
  const companyId = req.params.id;

  try {
    const company = await knex('companies')
      .where('id', companyId)
      .first();

    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during the recovery of the company.' });
  }
});

/**
 * Get all establishments
 */
app.get('/establishments', async (req, res) => {
  try {
    const establishments = await knex('establishments').select('*');
    res.json(establishments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred when retrieving the companies.' });
  }
});

/**
 * Get establishment by ID
 */
app.get('/establishments/:id', async (req, res) => {
  const establishmentId = req.params.id;

  try {
    const establishment = await knex('establishments')
      .where('id', establishmentId)
      .first();

    if (!establishment) {
      return res.status(404).json({ error: 'Establishment not found.' });
    }

    res.json(establishment);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred when retrieving the facility.' });
  }
});

/**
 * Get all company's establishments with company's ID
 */
app.get('/establishments/company/:id', async (req, res) => {
  const companyId = req.params.id;

  try {
    const establishments = await knex('establishments')
      .where('company_id', companyId)
      .select('*');

    if (establishments.length === 0) {
      return res.status(404).json({ error: 'No establishments found for this company.' });
    }

    res.json(establishments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred when retrieving the establishments.' });
  }
});

/**
 * Error 404
 */
app.use((req, res, next) => {
  res.status(404).json({ error: 'URL not valid.' });
});

/**
 * Internal error
 */
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'An internal error has occurred.' });
});

app.listen(port, () => {
  console.log(`Kabolt API listening on port ${port}`)
})