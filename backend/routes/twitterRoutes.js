const express = require('express')
const { getTweet } = require('../controllers/twitterController')
const router = express.Router()

router.route("/tweet/:tweet_id").get(getTweet)

module.exports = router