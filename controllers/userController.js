import User from "../models/User";

const registerUser = async (req,res,next) => {
    try {
        const {name, email, password} = req.body;
        let user = await User.findOne({email});
        if(user){
            throw new Error("User have already registered")
        }

        user = await User.create({
            name,
            email,
            password
        })

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            verified: user.verified,
            admin: user.admin,
            token : await user.generateJWT()
        })
        } catch (error){
            next(error)
        }
        
}

const loginUser = async (req, res, next) =>{
    try {
        const {email, password} = req.body;
        
        const user = User.findOne({email});

        if(!user){
            throw new Error("Email not found!")
        }

        if(user.comparePaassword(password)){
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                verified: user.verified,
                admin: user.admin,
                token : await user.generateJWT()
            })
        }
        else{
            throw new Error("Wrong password!")
        }

    } catch (error) {
        next(error)
    }
}
const userProfile = async (req,res,next) => {
    try {
       let user = User.findById(req.user._id)
       if(user){
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            verified: user.verified,
            admin: user.admin,
        })
       }
       else{
        let err = new Error("user not found!");
        err.statusCode = 404
        next(err)
       }
    } catch (error) {
        next(error)
    }
}
export {registerUser, loginUser, userProfile};