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

const updateUserProfile = async (req,res,next) => {
    try {
        let user = await User.findById(req.user._id);
        if(!user){
            throw new Error("User not Found!");
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.verified = req.body.verified || user.verified;
        if(req.body.password && (req.body.password.length < 6 && req.body.password.length > 15)) {
            throw new Error("Password length must be between 6 to 15 characters in length")
        } else if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedProfile = await user.save();
        res.json({
            _id: updatedProfile._id,
            name: updatedProfile.name,
            email: updatedProfile.email,
            verified: updatedProfile.verified,
            admin: updatedProfile.admin,
            token : await updatedProfile.generateJWT()
        })
        } catch (error) {
        next(error);
    }
}
export {registerUser, loginUser, userProfile, updateUserProfile};