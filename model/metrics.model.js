const mongoose = require("mongoose");

var metricsSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  totalGames:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
  totalLost:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
  totalQuits:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },

  totalQuestions:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
  totalQuestionsAnswered:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
  totalQuestionsRight:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
  totalPodium:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
  totalPoints:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
  totalStreak:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
  totalBonusPoints:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
  bestPlace:{
    type:Number,
    min:0,
    unsigned:true,
    default:0,
  },
});

module.exports =  mongoose.model("Metrics", metricsSchema);