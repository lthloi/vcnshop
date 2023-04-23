import ProductModel from '../models/product_schema.js'
import BaseError from "../utils/base_error.js"
import mongoose from "mongoose"
import { uploadReviewImages } from '../utils/upload_images.js'
import catchAsyncError from "../middlewares/catch_async_error.js"

//get a product by _id
const getProduct = catchAsyncError(async (req, res, next) => {
    if (!req.params) throw new BaseError('Params doesn\'t exist', 400)
    if (!req.params.productId) throw new BaseError('Wrong request property', 400)

    let product = await ProductModel.findOne(
        { _id: req.params.productId },
        { 'review.reviews': 0 },
    ).lean()

    if (!product) throw new BaseError('Product not found', 400)

    res.status(200).json({
        product,
    })
})

//get some products by query
const getProducts = catchAsyncError(async (req, res, next) => {
    let queryObject = {}

    let { keyword, category, price, rating, limit, pagination, for: forWho, type } = req.query
    if (!limit) throw new BaseError('Wrong request property', 400)

    if (keyword)
        queryObject.name = { $regex: new RegExp(keyword) }
    if (category)
        queryObject.category = category
    if (price)
        queryObject['price.value'] = { $gte: price.gte * 1, $lte: price.lte * 1 }
    if (rating)
        queryObject['review.average_rating'] = { $gte: rating * 1 }
    if (forWho)
        queryObject.for = { $in: [forWho] }
    if (type)
        queryObject.type = { $in: [...type] }

    let sort = req.query.sort || { name: 'name', type: 1 }

    let count_product = await ProductModel.countDocuments(queryObject)

    let products = await ProductModel
        .find(queryObject, { 'review.reviews': 0 })
        .skip((pagination - 1) * (limit * 1))
        .sort({ [sort.name]: sort.type })
        .limit(limit)
        .lean()

    if (!products) throw new BaseError('Products Not Found', 404)

    res.status(200).json({
        products,
        countProduct: count_product,
    })
})

const getReviews = catchAsyncError(async (req, res, next) => {
    let { productId, pagination, limit } = req.query
    if (!productId || !pagination || !limit)
        throw new BaseError('Wrong request property', 400)

    //format for query
    pagination *= 1
    pagination -= 1
    limit *= 1

    let review = await ProductModel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(productId) } },
        {
            $project: {
                '_id': 0,
                reviews: {
                    $slice: ['$review.reviews', pagination * limit, limit],
                }
            }
        }
    ])

    if (!review || !review[0].reviews) throw new BaseError('Reviews Not Found', 404)

    res.status(200).json({
        reviews: review[0].reviews,
    })
})

//insert new review to DB
const newReview = catchAsyncError(async (req, res, next) => {
    let { email, productId } = req.query
    if (!email || !productId) throw new BaseError('Wrong request property', 400)

    let { rating, comment, title } = req.body
    if (!rating || !comment || !title) throw new BaseError('Wrong request property', 400)

    let image_urls = await uploadReviewImages(req.files, productId, email)
    if (upload_error instanceof Error) throw upload_error

    //remove a review existed 
    let product_after_remove_review = await ProductModel.findOneAndUpdate(
        { _id: productId },
        { $pull: { 'review.reviews': { email } } },
        {
            new: true,
            projection: {
                '_id': 0,
                'review.reviews.rating': 1,
            },
        }
    ).lean()
    if (!product_after_remove_review) throw new BaseError('Product not found', 404)

    let new_count_review = product_after_remove_review.review.reviews.length + 1

    let sum_of_previous_ratings = product_after_remove_review.review.reviews.reduce((acc, curr) => acc + curr, 0)
    let new_average_rating = sum_of_previous_ratings === 0 ? rating : (sum_of_previous_ratings + rating) / 2

    //>>> fix this: fix
    let new_review = {
        name: 'VCN MAX',
        email: 'codevoicainay@gmail.com',
        avatar: 'https://img.freepik.com/premium-vector/cute-fox-sitting-cartoon-character-animal-nature-isolated_138676-3172.jpg?w=2000',
        createdAt: new Date(),
        rating,
        title,
        comment,
        imageURLs: image_urls || [],
    }

    //update review in database
    await ProductModel.updateOne(
        { _id: productId },
        {
            $set: {
                'review.average_rating': new_average_rating,
                'review.count_review': new_count_review,
            },
            $push: {
                'review.reviews': {
                    $each: [new_review],
                    $position: 0,
                }
            }
        },
    )

    res.status(200).json({
        newReview: new_review,
        newAverageRating: new_average_rating,
        newCountReview: new_count_review,
    })
})

export {
    getProducts, getProduct, getReviews,
    newReview,
}