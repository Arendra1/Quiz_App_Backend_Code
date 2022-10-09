import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js'


class UserController{
    static userRegistration = async (req , res)=>{
        const {name , email , accessLevel,  password , password_confirmation} = req.body

        // what is coming in body
        console.log(req.body);
        console.log("name : " , name);
        console.log("email : " , email);
        console.log("accessLevel : " , accessLevel);
        console.log("password : " , password);
        console.log("password_confirmation : " , password_confirmation);

        const user  = await UserModel.findOne({email:email})
        if(user){
            console.log("Email already exists");
            res.send({"status" : "failed" , "message" : "Email already exists" })
        }else{
            if(name && email && password && accessLevel && password_confirmation ){
                console.log("four fields are provided");
                if(password === password_confirmation){
                    console.log("password === password_confirmation");
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            name:name,
                            email:email,
                            accessLevel: accessLevel,
                            password:hashPassword,
                            // tc:tc
                        })
                        await doc.save()
                        console.log("successfully created user");
                        const saved_user = await UserModel.findOne({email:email})
                        // Generating JWT Token
                        const token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY , {expiresIn: '5d'})
                        res.status(201).send({"status": "success" , "message" : "Registration Successfull" , "token": token})
                    } catch (error) {
                        console.log(error);
                        res.send({"status": "failed" , "message" : "unable to register"})
                    }
                }else{
                    console.log("Password and confirm password doesn't match");
                    res.send({"status" : "failed" , "message" : "Password and confirm password doesn't match" })

                }
            }
            else{
                console.log("All fields are required");
            res.send({"status" : "failed" , "message" : "All fields are required" })

            }
        }
    }

    static userLogin = async (req , res)=>{
        try {
            const {email , password} = req.body;
            if(email && password)
            {
                const user  = await UserModel.findOne({email:email})
                if(user != null)
                {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if((user.email === email) && isMatch){
                        // Generate JWT Token
                        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY , {expiresIn: '5d'})
                        res.send({"status" : "success" , "message" : "You are successfully logged in" , "token":token,user:user })
                        
                    }else{
                        res.send({"status" : "failed" , "message" : "Email or password is Invalid", user:null })

                    }

                }else{
                    res.send({"status" : "failed" , "message" : "You are not a Registered user" ,user:null})
                    
                }
                 

            }else{
                res.send({"status" : "failed" , "message" : "All fields are required", user:null })

            }
            
        } catch (error) {
            console.log(error);
            res.send({"status" : "failed" , "message" : "Unable to Login", user:null })
        }
    }


    static changeUserPassword = async (req , res)=>{
        const {password , password_confirmation} = req.body
        if(password && password_confirmation){

            if(password === password_confirmation){
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                // console.log(req.user);
                await UserModel.findByIdAndUpdate(req.user._id, {$set :{password: newHashPassword}})
                res.send({"status" : "success" , "message" : "Password chnaged successfully" })

            }
            else{
                res.send({"status" : "failed" , "message" : "password and confirm password doesn't match" })
            }

        }
        else{
            res.send({"status" : "failed" , "message" : "All fields are required" })
        }
    }


    static loggedUser = async (req , res)=>{
        res.send({"user" : req.user});
    }


    static sendUserPasswordResetEmail = async (req , res)=>{
        const { email } = req.body;

        if(email){
            const user = await UserModel.findOne({email:email});
            if(user){
                
                const secret = user._id + process.env.JWT_SECRET_KEY;
                const token = jwt.sign({userID:user._id} , secret, {expiresIn: '15m'})
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log(link);
                console.log('Just Outside Transporter');
                // send Email
                // let info = await transporter.sendMail({
                //     from : process.env.EMAIL_FROM, 
                //     to: user.email,
                //     subject: "Geekshop - Password Reset Link",
                //     html : `<a href = ${link} >Click Here</a> to Reset Your Password`
                // })
                res.send({"status" : "success" , "message" : "Password Reset Email sent... Please chheck your Email" })


            }else{
                res.send({"status" : "failed" , "message" : "Email does not exists" })
            
            }

        }else{
            res.send({"status" : "failed" , "message" : "Email is required" })
            
        }
    }


    static userPasswordReset = async (req , res)=>{
        const { password , password_confirmation } = req.body;
        const { id , token } = req.params
        const user = await UserModel.findById(id);
        const new_secret = user._id + process.env.JWT_SECRET_KEY;
        try {
            jwt.verify(token, new_secret)
            if(password && password_confirmation){
                if(password === password_confirmation)
                {
                    const salt = await bcrypt.genSalt(10);
                    const newHashPassword = await bcrypt.hash(password, salt);
                    await UserModel.findByIdAndUpdate(user._id , {$set : {password: newHashPassword}})
                    res.send({"status": "success" , "message": "You have successfully changed your password"})

                }
                else{
                     res.send({"status": "failed" , "message": "Password and confirm password doesn't match"})

                }

            }else{
                res.send({"status": "failed" , "message": "All Fields are required"})

            }


        } catch (error) {
            console.log(error);
            res.send({"status": "failed" , "message": "Invalid Token"})
            
        }
    }


}


export default UserController 