const express=
require("express")

const auth=
require("../middleware/auth")

const fs=require("fs")
const path=require("path")
const {v4:uuid}=require("uuid")

const router=
express.Router()

const file=path.join(__dirname,"../data/orders.json")

function getOrders(){
	try{
		return JSON.parse(fs.readFileSync(file,"utf8"))
	}catch{
		return[]
	}
}

function saveOrders(data){
	fs.writeFileSync(file,JSON.stringify(data,null,2))
}

router.post(

"/",

auth,

(req,res)=>{

	const {items,total} = req.body
	const orders = getOrders()
	const order = {
		id: uuid(),
		userId:req.user.userId,
		items: items || [],
		total: total || 0,
		createdAt: new Date().toISOString()
	}
	orders.push(order)
	saveOrders(orders)
	res.json({
		message:"Order placed",
		orderId: order.id
	})

}

)

module.exports=
router