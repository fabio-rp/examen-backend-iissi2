import { Review, Order } from '../models/models.js'

const userHasPlacedOrderInRestaurant = async (req, res, next) => {
  try {
    console.log('arraka')
    const orders = await Order.count({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
    if (orders < 1) return res.status(409).send('User has no orders in this restaurant.')
    return next()
  } catch {
    res.status(500).json({ message: 'Internal server error: userHasPlacedOrderInRestaurant' })
  }
}

const checkCustomerHasNotReviewed = async (req, res, next) => {
  try {
    const count = await Review.count({
      where: {
        restaurantId: req.params.restaurantId,
        customerId: req.user.id
      }
    })
    if (count >= 1) return res.status(409).send('User has already reviewed.')
    return next()
  } catch {
    res.status(500).json({ message: 'Internal server error: checkCustomerHasNotReviewed' })
  }
}

const checkReviewOwnership = async (req, res, next) => {
  const review = await Review.findByPk(req.params.reviewId)
  if (review.customerId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to modify this review.' })
  }
  next()
}

const checkReviewBelongsToRestaurant = async (req, res, next) => {
  const { restaurantId, reviewId } = req.params

  try {
    const review = await Review.findByPk(reviewId)

    // El comparador doble es intencionado por la diferencia de tipo de datos string vs integer
    // eslint-disable-next-line eqeqeq
    if (review.restaurantId != restaurantId) {
      return res.status(409).json({ error: 'Review does not belong to the specified restaurant.' })
    }

    next()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export { checkCustomerHasNotReviewed, userHasPlacedOrderInRestaurant, checkReviewOwnership, checkReviewBelongsToRestaurant }
