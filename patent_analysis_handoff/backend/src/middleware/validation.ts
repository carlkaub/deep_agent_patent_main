
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  personaType: Joi.string().valid('inventor', 'corporate_rd', 'patent_attorney', 'business_strategist').required(),
  organization: Joi.string().max(255).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const projectSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  projectType: Joi.string().required(),
  settings: Joi.object().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  color: Joi.string().optional()
});

const analysisSchema = Joi.object({
  patentNumber: Joi.string().optional(),
  patentTitle: Joi.string().optional(),
  analysisType: Joi.string().required(),
  inputData: Joi.object().required()
});

const batchJobSchema = Joi.object({
  jobName: Joi.string().min(1).max(255).required(),
  jobType: Joi.string().required(),
  inputData: Joi.array().min(1).max(1000).required(),
  analysisType: Joi.string().required(),
  configuration: Joi.object().optional()
});

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { error } = registrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateAnalysis = (req: Request, res: Response, next: NextFunction) => {
  const { error } = analysisSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateBatchJob = (req: Request, res: Response, next: NextFunction) => {
  const { error } = batchJobSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
