// controllers/transactionController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({errorFormat: "pretty"});

// Create Transaction
export const createTransaction = async (req: Request, res: Response) => {
  const { amount, description, type } = req.body;
  try {
    const transaction = await prisma.transaction.create({
      data: { amount, description, type }, // Menyertakan tipe transaksi
    });
    res.status(201).json({
      message: "Transaction added successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};


// Get All Transactions
export const getAllTransactions = async (req: Request, res: Response) => {
  try {

    const data = await prisma.transaction.findMany();
    
    res.status(200).json({
      massage:`Transactions retrieved successfully`,
      data
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};


// Update Transaction
export const updateTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, description, type } = req.body; // Menyertakan 'type'
  try {
    const transaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: { amount, description, type }, // Memperbarui 'type' juga
    });
    res.json({
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ error: `Failed to update transaction${error }` });
  }
};

// Calculate Total Amount by Type
export const calculateTotalByType = async (req: Request, res: Response) => {
  const { type } = req.query;

  // Validasi tipe transaksi
  if (type !== 'income' && type !== 'expensive') { // Ganti 'expense' dengan 'expensive'
    return res.status(400).json({
      message: "Invalid transaction type or no transactions found for the given type"
    });
  }

  try {
    const total = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: type as 'income' | 'expense', // Ganti 'expense' dengan 'expensive'
      },
    });

    // Cek apakah total dan total._sum ada
    if (!total || !total._sum) {
      return res.status(404).json({
        message: "Invalid transaction type or no transactions found for the given type"
      });
    }

    // Cek apakah ada transaksi untuk tipe tersebut
    if (total._sum.amount === null) {
      return res.status(404).json({
        message: "Invalid transaction type or no transactions found for the given type"
      });
    }

    res.json({
      message: "Total calculated successfully",
      data: {
        type,
        totalAmount: total._sum.amount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate total amount' });
  }
};

// Delete Transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.transaction.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: `tidak ada id: ${id}` });
  }
};

// Generate Financial Report
export const generateReport = async (req: Request, res: Response) => {
  try {
    const report = await prisma.transaction.groupBy({
      by: ['createdAt'],
      _sum: {
        amount: true,
      },
    });

    const result = report.map(item =>({
      
      amount: item._sum.amount
    }))
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
};