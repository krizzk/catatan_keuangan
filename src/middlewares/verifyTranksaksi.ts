// import { Category } from "@prisma/client";
// middleware/validationMiddleware.ts
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const transactionSchema = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string().required(),
  type: Joi.string().valid('income', 'expense').required(), // Menambahkan tipe transaksi
});

export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const { error } = transactionSchema.validate(req.body,{abortEarly:false});
  if (error) {
    return res.status(400).json({
      status: false,
      massage: error.details.map(it => it.message).join()
  })
  }
  next();
};

const schema = Joi.object({
  amount: Joi.number().optional(),
  description: Joi.string().optional(),
  type: Joi.string().valid('income','expense').optional(),
});

export const validateUpdateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body,{abortEarly:false});
  if (error) {
    return res.status(400).json({
      status: false,
      massage: error.details.map(it => it.message).join()
    })
  }
  next();
}