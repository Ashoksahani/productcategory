const { stat, realpathSync } = require('fs')
const product = require('../model/product.js')

const objectId = require('mongoose').Types.ObjectId;


const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}




const createproducts = async function (req, res) {
    try {

        const data = req.body

        const { productName, description, category, price, productType } = data

        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "please enter some data to create user" })
        }


        if (!isValid(productName)) { return res.status(400).send({ status: false, msg: "please enter the productName" }) }

        if (!isValid(description)) { return res.status(400).send({ status: false, msg: "please enter the description" }) }
        if (!isValid(category)) { return res.status(400).send({ status: false, msg: "please enter the  category" }) }
        if (!isValid(price)) { return res.status(400).send({ status: false, msg: "please enter the price" }) }
        if (!isValid(productType)) { return res.status(400).send({ status: false, msg: "please enter the price between :equipments,clothings,accessories " }) }

        if (!["equipments", "clothings", "accessories"].includes(productType)) {
            return res.status(400).send({
                status: false, message: `title must be provided from these values:equipments,clothings,accessories `,
            });
        }



        const creaters = await product.create(data)
        return res.status(201).send({ status: true, msg: "data created sucessfully", data: creaters })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }
}

const getproduct = async function (req, res) {
    try {
        //let productid = req.params.productid

        let producter = req.query
        if (Object.keys(producter) == 0) {
            const AlleventData = await product.find()
            return res.status(200).send({ status: true, msg: 'product Data is Here', data: AlleventData })
        }
        let { productid, productName, page = 1, limit = 10 } = producter


        if (productid) {
            if (!isValid(productid)) {
                return res.status(400).send({ msg: "please the product id" })
            }

            if (!objectId.isValid(productid)) {
                return res.status(400).send({ status: false, msg: 'enter valid userId' })
            }

            const datas = await product.findOne({ _id: productid, isDeleted: false })
            if (!datas) {
                return res.status(404).send({ status: false, msg: "the data not found correct please enter  id" })
            }
            return res.status(200).send({ status: true, data: datas })
        }



        if (productName) {
            let findName = await product.find({ productName: { $regex: productName, $options: "i" }, });

            if (findName == 0) {
                return res.status(404).send({ status: false, msg: 'name not found' })
            }

            return res.status(200).send({ status: true, msg: 'Data found by name', data: findName })
        }

        if (page || limit) {

            const events = await product.find().limit(limit * 1).skip((page - 1) * limit);

            if (events == 0) {
                return res.status(404).send({ status: false, msg: 'out range of documents' })
            }

            return res.status(200).send({ status: true, msg: 'data found by pagination', total: events.length, events })

        }




    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}


const updateproduct = async function (req, res) {
    try {

        let data = req.body
        const { productName, description, category, price, productType } = data
        let productids = req.params.productid

        if (!isValid(productids)) {
            return res.status(400).send({ status: false, msg: "please enter the productid for updates" })
        }

        if (!objectId.isValid(productids)) {
            return res.status(400).send({ status: false, msg: 'enter valid productId' })
        }

        //let productes=await product.findOne({_id:productids})
        // if(!productes){
        //     return res.status(404).send({status:false,msg:"product id not found"})
        // }

        if (data.productType) {

            if (!["equipments", "clothings", "accessories"].includes(data.productType)) {
                return res.status(400).send({
                    status: false, msg: `title must be provided from these values:equipments,clothings,accessories `,
                });
            }
        }

        let updateBookData = {

            productName: productName,
            description: description,
            category: category,
            price: price,
            productType: productType
        }
        let updated = await product.findOneAndUpdate({ _id: productids, isDeleted: false },
            { $set: updateBookData }, { new: true })


        if (!updated) {
            return res.status(404).send({ status: false, msg: "product id not found" })
        }
        return res.status(200).send({ status: true, msg: "udated sucessful", data: updated })

    }
    catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

const deletedproduct = async function (req, res) {
    try {
        const data = req.params.productid

        if (!objectId.isValid(data)) {
            return res.status(400).send({ status: false, msg: 'enter valid productId' })
        }


        const datas = await product.findOneAndUpdate({ _id: data, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        return res.status(200).send({ staus: true, msg: "delete product sucessfully", data: datas })


    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}


module.exports = { createproducts, getproduct, updateproduct, deletedproduct }