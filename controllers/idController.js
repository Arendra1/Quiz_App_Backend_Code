import idModel from "../models/incremnet.js";
import quizModel from "../models/quiz.js";
import axios from 'axios';

class idController {
  static addId = async (req, res) => {
    idModel.findOneAndUpdate(
      { id: "autoval" },
      { $inc: { count: 1 } },
      { new: true },
      async (err, cd) => {
        try {
          let seqId ;
          if (cd == null) {
            const newVal = new idModel({ id: "autoval", count: 1 });
            newVal.save();
            seqId = 1;
            // res.send({
            //   status: "succes",
            //   message: "Added first Id successfully",
            // });
          } else {
            seqId = cd.count;
            // res.send({
            //   status: "succes",
            //   message: "Added second Id successfully",
            // });
          }

          let quizId = seqId;
          const { quizName, category, difficultyLevel } = req.body;

          const doc = new quizModel({
            quizId,
            quizName,
            category,
            difficultyLevel,
            
          });


          try{
            const response = await axios.post('http://localhost:8000/api/quiz/addQuiz', doc);
            console.log("Below Data Is from counter Table");
            console.log(response.data);
            if(response.message == "successfully Added Quiz")
            {
              res.status(201).send({
                status: "success",
                message: "Quiz Added Successfully",
              });
            }
            else{
              res.send({"status": "failed" , "message" : "Quiz Already Exists"})
            }
            
          }catch(err)
          {
            console.log(err.name);
            console.log(err.message);
            res.status(400).send({
              status: "failed",
              message: "Quiz not Added",
            });
          }
          

        } catch (error) {
          console.log(error.name);
          console.log(error.message);
          res.send({ status: "failed", message: "Some error has occured" });
        }
      }
    );
  };

  static getData = async (req, res) => {
    try {
      const result = await idModel.find();
      res.send({
        status: "success",
        message: "Id count is fetched",
        result,
      });
      console.log(result);
    } catch (eroor) {
      //   console.log(error);
      res.send({ status: "failed", message: "Not able to fetch the data" });
    }
  };
}

export default idController;
