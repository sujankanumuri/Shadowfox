const express=require("express")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const fs=require("fs")
const path=require("path")
const {v4:uuid}=require("uuid")

const router=
express.Router()

const file=
path.join(
__dirname,
"../data/users.json"
)

function getUsers(){

try{

return JSON.parse(
fs.readFileSync(
file,
"utf8"
)
)

}

catch{

return[]

}

}

function save(data){

fs.writeFileSync(
file,
JSON.stringify(
data,
null,
2
)
)

}

router.post(
"/register",

async(req,res)=>{

const{
name,
email,
password
}=req.body

const users=
getUsers()

if(
users.find(
u=>u.email===email
)
){

return res.status(400)
.json({
message:"Already exists"
})

}

const hash=
await bcrypt.hash(
password,
10
)

users.push({

id:uuid(),

name,

email,

password:hash,

role:"user"

})

save(users)

res.json({

message:"Registered"

})

}

)

router.post(
"/login",

async(req,res)=>{

const{
email,
password
}=req.body

const users=
getUsers()

const user=
users.find(
u=>u.email===email
)

if(!user){

return res.status(404)
.json({
message:"User not found"
})

}

const ok=
await bcrypt.compare(
password,
user.password
)

if(!ok){

return res.status(400)
.json({
message:"Wrong password"
})

}

const token=
jwt.sign({

userId:user.id,

role:user.role

},

process.env.JWT_SECRET || "default-secret"

)

res.json({

token,

role:user.role

})

}

)

module.exports=router