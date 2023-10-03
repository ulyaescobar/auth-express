'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Menambahkan validasi bahwa firstName tidak boleh kosong
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Menambahkan validasi bahwa lastName tidak boleh kosong
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // Memastikan bahwa nilai yang dimasukkan adalah alamat email yang valid
        notEmpty: true, // Menambahkan validasi bahwa email tidak boleh kosong
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Menambahkan validasi bahwa password tidak boleh kosong
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });


  return User;
};