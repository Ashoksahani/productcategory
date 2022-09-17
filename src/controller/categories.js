const product = require('../model/product.js')
const objectId = require('mongoose').Types.ObjectId;
const category = require('../model/categories.js')



const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}




const aws = require("aws-sdk")

aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKey: "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",
        region: "ap-south-1"
    }
)

//uploading An Image File to AWS
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {

        let s3 = new aws.S3({ apiVersion: "2006-03-01" })

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "ashok/" + file.originalname,
            Body: file.buffer
        }
        console.log(uploadFile)
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }

            return resolve(data.Location)
        }
        )

    }
    )
}



const isValidImageType = function (value) {
    const regexForMimeTypes = /image\/png|image\/jpeg|image\/jpg/;
    return regexForMimeTypes.test(value)
}

const create = async function (req, res) {
    try {

        const data = req.body
        const { name, description, products } = data

        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "please enter some data to create user" })
        }


        if (!isValid(name)) { return res.status(400).send({ status: false, msg: "please enter the name" }) }

        if (!isValid(description)) { return res.status(400).send({ status: false, msg: "please enter the description" }) }

        if (!isValid(products)) { return res.status(400).send({ status: false, msg: "please enter the product id" }) }

        if (!objectId.isValid(products)) {
            return res.status(400).send({ status: false, msg: 'enter valid productid' })
        }

        const productes = await product.findById({ _id: products })
        if (!productes) {
            return res.status(404).send({ status: false, msg: 'productid not found' })
        }

        // if (!isValid(image)) { return res.status(400).send({ status: false, msg: "please enter the image" }) }

        const image = req.files;

        if (!image || image.length === 0) {
            return res.status(400)
                .send({ status: false, message: " image is required" });
        }

        if (!isValidImageType(image[0].mimetype)) {
            return res.status(400).send({ status: false, message: "Only images can be uploaded (jpeg/jpg/png)" });
        }
        // uploading image to AWS server and creating url
        //const countryImageUrl = await aws.uploadFile(image[0]);

        let profileImagessweetselfie = await uploadFile(image[0]);

        const dataes = {
            name: name,
            description: description,
            products: productes,
            image: profileImagessweetselfie

        }


        const dataess = await category.create(dataes)
        return res.status(201).send({ status: true, msg: "categories created", data: dataess })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const getcategry = async function (req, res) {
    try {
        // const data =req.params.categoryid

        const datase = req.query

        if (Object.keys(datase) == 0) {
            const AlleventData = await category.find()
            return res.status(200).send({ status: true, msg: 'product Data is Here', data: AlleventData })
        }

        const { data, name, page = 1, limit = 10 } = datase
        if (data) {
            const datas = await category.findOne({ _id: data, isDeleted: false })

            if (!datas) {
                return res.status(404).send({ msg: "category id not found" })
            }

            return res.status(200).send({ status: true, msg: "data found", data: datas })
        }

        if (name) {
            let findName = await category.find({ name: { $regex: name, $options: "i" }, });

            if (findName == 0) {
                return res.status(404).send({ status: false, msg: 'name not found' })
            }

            return res.status(200).send({ status: true, msg: 'Data found by name', data: findName })
        }

        if (page || limit) {

            const events = await category.find().limit(limit * 1).skip((page - 1) * limit);

            if (events == 0) {
                return res.status(404).send({ status: false, msg: 'out range of documents' })
            }

            return res.status(200).send({ status: true, msg: 'data found by pagination', total: events.length, events })

        }

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const updatecategory = async function (req, res) {
    try {
        const data = req.body

        const { name, description, products } = data


        if (!isValid(products)) { return res.status(400).send({ status: false, msg: "please enter the product id" }) }

        if (!objectId.isValid(products)) {
            return res.status(400).send({ status: false, msg: 'enter valid productid' })
        }

        // const productes=await category.findOne({products:products})
        // if(!productes){
        //     return res.status(404).send({status:false,msg:'productid not found'})
        // }
        const image = req.files;
        if (image) {



            if (!image || image.length === 0) {
                return res.status(400)
                    .send({ status: false, message: " image is required" });
            }

            if (!isValidImageType(image[0].mimetype)) {
                return res.status(400).send({ status: false, message: "Only images can be uploaded (jpeg/jpg/png)" });
            }
            // uploading image to AWS server and creating url
            //const countryImageUrl = await aws.uploadFile(image[0]);

            var profileImagessweetselfie = await uploadFile(image[0]);


        }


        let updateBookData = { name: name, description: description, products: products, image: profileImagessweetselfie }
        let updated = await category.findOneAndUpdate({ products: data.products, isDeleted: false }, { $set: updateBookData }, { new: true })

        if (!updated) {
            return res.status(404).send({ msg: "data not found" })
        }

        return res.status(201).send({ status: true, msg: "data updated", data: updated })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const deletedproduct = async function (req, res) {
    try {
        let data = req.params.categoryid

        let datas = await category.findOneAndUpdate({ _id: data, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        if (!datas) {
            return res.status(404).send({ msg: "data not found" })
        }
        return res.status(200).send({ status: true, msg: "data deleted", data: datas })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports = { create, getcategry, updatecategory, deletedproduct }