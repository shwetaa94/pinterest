const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pin");

const userSchema =  mongoose.Schema({

  username:{ type: String, required: true ,unique:true },
  fullname: { type: String, required: true },
  email: { type: String, required: true ,unique:true},
  password: { type: String },
  posts: {
    type: Array,
    default:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      } ]
  } 

});

userSchema.plugin(plm);
module.exports = mongoose.model("User", userSchema);

 
