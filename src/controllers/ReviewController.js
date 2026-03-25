import { body } from 'express-validator'
import { Review } from '../models/models.js'

const ReviewController = {

  async index (req, res) {
    const { restaurantId } = req.params
    try {
      const reviews = await Review.findAll({
        where: {
          restaurantId
        }
      })
      return res.json(reviews)
    } catch {
      res.status(500).send('Error during GET restaurants.')
    }
  },

  async create (req, res) {
    try {
      const review = Review.build(req.body)
      review.customerId = req.user.id
      review.restaurantId = req.params.restaurantId
      const savedReview = await review.save()
      res.json(savedReview)
    } catch {
      res.status(500).send('Internal server error: reviewController.create')
    }
  },

  async update (req, res) {
    try {
      req.body.id = req.params.reviewId
      req.body.customerId = req.user.id
      req.body.restaurantId = req.params.restaurantId
      await Review.update(req.body, {
        where: {
          id: req.params.reviewId
        }
      })
      res.json(await Review.findByPk(req.params.reviewId))
    } catch {
      res.status(500).send('Internal server error: reviewController.update')
    }
  },

  async destroy (req, res) {
    try {
      const result = await Review.destroy({ where: { id: req.params.reviewId } })
      let message = ''
      if (result === 1) {
        message = 'Sucessfuly deleted review id.' + req.params.reviewId
      } else {
        message = 'Could not delete review.'
      }
      return res.json(message)
    } catch {
      res.status(500).send('Internal error server: ReviewController.destroy')
    }
  }

}

export default ReviewController
