'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const SHEETDB_API_URL = process.env.SHEETDB_API_URL || null;

if (!SHEETDB_API_URL) {
  console.log("[warning] No API connected yet");
}

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// ✅ Root route (IMPORTANT)
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

const sheetDbClient = axios.create({
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

function sanitizeInput(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\u0000-\u001F\u007F]/g, '').trim();
}

async function fetchSheetRows() {
  const response = await sheetDbClient.get(SHEETDB_API_URL);

  if (!Array.isArray(response.data)) {
    throw new Error('Invalid SheetDB response');
  }

  return response.data;
}

// ✅ ONLY VERIFY ROUTE
app.get('/verify/:certificate_no', async (req, res) => {
  const certificateNo = sanitizeInput(req.params.certificate_no);

  if (!certificateNo) {
    return res.status(400).json({
      status: 'invalid',
      message: 'certificate_no cannot be empty',
    });
  }

  try {
    const rows = await fetchSheetRows();
    const normalizedInput = certificateNo.toLowerCase();

    const match = rows.find((row) => {
      const rowCertificateNo = sanitizeInput(
        row?.registrationNo || row?.['transactionID/UTRNumber'] || ''
      ).toLowerCase();

      return rowCertificateNo === normalizedInput;
    });

    if (!match) {
      return res.json({
        status: 'invalid',
        message: 'Certificate not found',
      });
    }

    return res.json({
      status: 'valid',
      data: match,
    });
  } catch (error) {
    console.error('[verify] error', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// ❌ Fallback
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

app.listen(PORT, () => {
  console.log(`[startup] Server running on port ${PORT}`);
});