import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'
 
const checkUserAuth = async (req , res , next)=>{
    console.log('Something went wrong in checkuserauth');
    let token
    const { authorization } = req.headers

    if(authorization && authorization.startsWith('Bearer')){

        try {
            // get token from header
            token = authorization.split(' ')[1]
            console.log("token : " , token);

            // Verify Token
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(userID);
            

            // get user from token 
            req.user = await UserModel.findById(userID).select('-password')
            // console.log(req.user);
            next()

        } catch (error) {
            res.status(401).send({"status": "failed", "message" :"Unauthorized User"})
        }
    }

    if(!token){
        res.status(401).send({"status": "failed", "message" :"Unauthorized User , NO token"})

    }
}


export default checkUserAuth