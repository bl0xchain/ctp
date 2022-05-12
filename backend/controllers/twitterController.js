const axios = require('axios')
const asyncHandler = require('express-async-handler')


const getTweet = asyncHandler( async(req, res) => {
    const endpointURL = "https://api.twitter.com/2/tweets";
    const { tweet_id } = req.params
    if(tweet_id) {
        try {
            const tweet = await axios.get(endpointURL, {
                headers: {
                    "User-Agent": "v2TweetLookupJS",
                    "authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
                },
                params: {
                    "ids": tweet_id,
                    "expansions": "author_id",
                    "user.fields": "name,username"
                }
            })
            res.status(200).json(tweet.data)
        } catch (error) {
            console.log(error.message)
            res.status(400)
            throw new Error("Connet fetch tweet")
        }
    } else {
        res.status(400)
        throw new Error("Tweet id missing")
    }
} )

module.exports = {
    getTweet,
} 