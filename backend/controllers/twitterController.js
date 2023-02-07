const axios = require('axios')
const asyncHandler = require('express-async-handler')
const { TwitterApi } = require('twitter-api-v2');
const Twit = require('twit');

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
            throw new Error("Connot fetch a tweet")
        }
    } else {
        res.status(400)
        throw new Error("Tweet id is missing")
    }
} )

const postTweet1 = async(message) => {
    // try {
    //     const twitterClient = new TwitterApi("AAAAAAAAAAAAAAAAAAAAAINHlgEAAAAAnLExcLMce4vZlbQx9D6cYty%2BX8c%3Dsg8jR0nkXMuE3qOiQ4kUmeVNRRgU9SrtJ0xoejRlqaremakEbI");
    //     await twitterClient.v1.tweet('Hello, this is a test.');
    // } catch (error) {
    //     console.log(error)
    // }
    try {
        var T = new Twit({
            consumer_key: process.env.TWITTER_API_KEY,
            consumer_secret: process.env.TWITTER_API_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret:process.env.TWITTER_ACCESS_SECRET,
            timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
            strictSSL:            false,     // optional - requires SSL certificates to be valid.
        })
        T.post('statuses/update', { status: message }, function(err, data, response) {
            console.log(data)
        })
    } catch (error) {
        console.log(error);
    }
    
}

const tweetCTPChange = async(ctp10_value) => {
    try {
        let message = `CTP10 value has been updated to ${ctp10_value}. Visit https://ctpindex.com to check more details.`;
        const tweet = new Twit({
            consumer_key: process.env.TWITTER_API_KEY,
            consumer_secret: process.env.TWITTER_API_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret:process.env.TWITTER_ACCESS_SECRET,
            timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
            strictSSL:            false,     // optional - requires SSL certificates to be valid.
        })
        tweet.post('statuses/update', { status: message }, function(err, data, response) {
            console.log(data)
        })
    } catch (error) {
        console.log(error);
    }
    
}

const postTweet = asyncHandler( async(req, res) => {
    const endpointURL = "https://api.twitter.com/2/tweets";
    const { message } = req.body
    if(message) {
        try {
            await tweetCTPChange("8439.456345");
            res.status(200).json({status: 'Done'})
        } catch (error) {
            console.log(error.message)
            res.status(400)
            throw new Error("Connot post a tweet")
        }
        
    } else {
        res.status(400)
        throw new Error("Message is missing")
    }
} )

module.exports = {
    getTweet,
    postTweet
} 