const mongoose = require('mongoose');
const { Schema } = mongoose;

const userdatasSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
      },
    email: {
        type: String,
        unique: true,
        trim: true,
        validate: {
          validator: function(v) {
            return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(v);
          },
          message: props => `${props.value} is not a valid Email`
        },
        required: [true, 'User Email is required']
      },
    password: {
        type: String,
        trim: true,
        required: true
      },
    pic: {
        type: String,
        default:'https://img.freepik.com/free-icon/user_318-159711.jpg'
      },
    token : {type: String}
  },{timestamps:true});
  
exports.userdatas = mongoose.model('userdatas', userdatasSchema);