const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_comments', {
    idComment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    creationAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idAccount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'idAccount'
      }
    },
    idProduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'idProduct'
      }
    }
  }, {
    sequelize,
    tableName: 'product_comments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idComment" },
        ]
      },
      {
        name: "fk_comment_account_idx",
        using: "BTREE",
        fields: [
          { name: "idAccount" },
        ]
      },
      {
        name: "fk_comment_product_idx",
        using: "BTREE",
        fields: [
          { name: "idProduct" },
        ]
      },
    ]
  });
};
