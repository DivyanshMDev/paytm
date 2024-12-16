const express=require("express");
const zod=require("zod");
const { User,Account } = require("../db");
const router = express.Router();
const jwt=require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const { authMiddleware } = require("../middleware");

const signupschema=zod.object({
    username:zod.string(),
    password:zod.string(),
    firstName:zod.string(),
   
})
router.post("/signup",async(req,res)=>{
    const body=req.body;
    const{success}=signupschema.safeParse(req.body);
    if(!success){
        return res.json({
            message:"Email alreday taken/incorrect input"
        })
    }


const user=await User.findOne({
    username:body.username
})//for existing user y kr rh hu

if(user){
    return res.json({
        message:"Email already taken/Incorrect Input"
    })
}


const dbUser=await User.create(body);
await Account.create({
    userId: dbUser._id,
    balance: 1 + Math.random() * 10000,
});


const token=jwt.sign({
    userId:dbUser._id
},JWT_SECRET)
res.json({
    message:"User created succesfully",
    token:token
})


})



const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})



const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})
router.put("/",authMiddleware,async(req,res)=>{
    const {success}=updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            messsage:"Error while updating"
        })
    }
    await User.updateOne({_id:req.userId},req.body);
    res.json({
        message:"Updated succesfully"
    })
})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports=router;
