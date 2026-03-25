import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate (models) {
      Review.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' })
      Review.belongsTo(models.User, { foreignKey: 'customerId', as: 'customer' })
    }
  }

  Review.init({
    stars: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    body: DataTypes.INTEGER,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    customerId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    restaurantId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Review'
  })

  return Review
}

export default loadModel
