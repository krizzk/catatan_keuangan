import express from "express";
import {
    createTransaction,
    getAllTransactions,
    updateTransaction,
    deleteTransaction,
    generateReport,
    calculateTotalByType,
  } from "../controllers/TransaksiC";      
import { validateTransaction, validateUpdateTransaction } from "../middlewares/verifyTranksaksi";

const app = express()
app.use(express.json())

app.get(`/`,getAllTransactions)
app.post(`/Create`,[validateTransaction],createTransaction)
app.put('/update/:id',[validateUpdateTransaction],updateTransaction)
app.delete('/delete/:id',deleteTransaction)
app.get(`/total`,calculateTotalByType)

app.get(`/generateReport`,generateReport)

export default app;   