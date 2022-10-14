import e from 'express';
import express from 'express';
import quizController from '../controllers/quizControllers.js';

const router = express.Router();


// Public Routes
router.post('/addQuiz' ,  quizController.addQuiz)
router.get('/quizzes' , quizController.getAllQuizzes)
router.post('/getQuiz' , quizController.getQuiz)
router.post('/updateQuiz' , quizController.updateQuiz)
router.post('/getQuizByName' , quizController.getQuizByName)
router.post('/addQuestion' , quizController.addQuestion)
router.post('/incAttemptedBy' , quizController.incAttemptedBy)


export default router