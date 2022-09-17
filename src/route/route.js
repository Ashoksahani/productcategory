const express=require('express')

const router=express.Router();


const controller=require('../controller/product.js')
const categories=require('../controller/categories.js')



router.post('/createproduct',controller.createproducts)
router.get('/getproduct',controller.getproduct)

router.put('/updatedproduct/:productid',controller.updateproduct)
router.delete('/deleteproduct/:productid',controller.deletedproduct)

router.post('/createcategories',categories.create)
router.get('/getcategories',categories.getcategry)
router.put('/updatecategories',categories.updatecategory)
router.delete('/deletecategories/:categoryid',categories.deletedproduct)


module.exports=router
