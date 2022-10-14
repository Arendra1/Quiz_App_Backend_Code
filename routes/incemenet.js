
import express from 'express';
import idController from '../controllers/idController.js';

const router = express.Router();


// Public Routes
router.post('/addId' ,  idController.addId)
router.get('/getIds' , idController.getData)


export default router