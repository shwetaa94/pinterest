const mongoose = require("mongoose");
// const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pin");

const postSchema =  mongoose.Schema({

  postText: {
    type : String,
    required: true,
  },
  image:{
    type : String,
    required: true,
  } ,
  createdAt: {
      type: Date,
      default: Date.now
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  
});

// postSchema.plugin(plm);
module.exports = mongoose.model("Post", postSchema);

 
