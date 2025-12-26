const express = require('express')
const { createOrder, getOrderByUser, getOrderById, deleteOrderPending, cancelOrder } = require('../controller/orderController')
const userAuth = require('../middlewares/userAuth')
const adminAuth = require('../middlewares/adminAuth')

const router = express.Router()

router.post('/',userAuth,createOrder)
router.get("/",userAuth,getOrderByUser)
router.get('/:id',userAuth,getOrderById)
router.delete('/:id',userAuth,cancelOrder) // delete  order if it is in pending stage
// router.get('/all',adminAuth,)

// router.put("/")
// router.delete("/:id", deleteOrder);

module.exports = router