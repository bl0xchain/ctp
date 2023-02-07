const express = require('express')
const { getTweet, postTweet } = require('../controllers/twitterController')
const router = express.Router()

// router.route("/create").post(postTweet)
router.route("/tweet/:tweet_id").get(getTweet)

module.exports = router