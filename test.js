// API 생성을 위한 모듈 가져오기
const express = require('express');
const app = express();
const PORT = 2697;

var bodyParser = require('body-parser');
const { Connection } = require('tedious');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// 크롤링 관련 모듈 가져오기
const axios = require("axios");
const cheerio = require("cheerio");

// 현재 날짜, 시간을 가져오기 위한 모듈
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

app.post('/gitTest', (req, res) => {
    let gitURL = req.body.gitURL;

    console.log("Git Commit Test API")

    GetCommitStatus(gitURL).then(function(resultMessage) {
        console.log("[결과]\n" + resultMessage);
        res.status(200).json(
            {
                "Message": resultMessage
            }
        );
    });
})

function GetCommitStatus(gitURL) {

    return new Promise(function(resolve, reject) {
        const getGitHtml = async () => {
            try {
                return await axios.get(gitURL);
            } catch (error) {
                console.error(error);
            }
        };

        getGitHtml().then(html => {
            const $ = cheerio.load(html.data);
            const $bodyList = $("div.border.py-2.graph-before-activity-overview g").children("rect");

            let list = {};

            let today = moment().format('YYYY-MM-DD');
            
            $bodyList.each(function(i, elem) {
                if (today == $(this).attr('data-date')) {
                    list = {
                        date: $(this).attr('data-date'),
                        count: $(this).attr('data-count')
                    };
                }
            });

            resolve(list);
        });
    })
}

app.listen(PORT, () =>
	console.log('Running on http://localhost:' + PORT.toString())
)