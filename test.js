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

// mssql 모듈 가져오기
const sql = require('mssql');
// DB 정보 가져오기
const config = require('./Config/dbInfo');

app.post('/gitTest', (req, res) => {
    let gitURL = req.body.gitURL;

    console.log("Git Commit Test API")

    CompareCommitStatus().then(function(resultMessage) {
        res.status(200).json(
            {
                "Message": resultMessage
            }
        );
    });
})

function CompareCommitStatus() {

    let UserName = "야호";

    return new Promise(function(resolve, reject) {
        const connection = sql.connect(config, (err) => {
            if (err) {
                console.log("[DB 연동 실패]");
                console.log(err);
            } else {
                console.log("[DB 연동 성공]");

                const request = connection.request();
                request.input('UserName', sql.NVarChar(50), UserName)
                       .execute('GitCommitRoomSelectURL', (err, recordsets, returnValue) => {
                           if (err) {
                               console.log("[sp 접근 실패]");
                               console.log(err);
                           } else {
                               console.log("[sp 접근 성공]");

                               let GitURL = recordsets.recordset[0].GitURL;                                

                               const getGitHtml = async () => {
                                    try {
                                        return await axios.get(GitURL);
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
                        
                                    let Message = "";
                                    if (list.count > 0) {
                                        Message = "인증 성공";
                                    } else {
                                        Message = "인증 실패";
                                    }

                                    resolve(Message);
                                });
                            }
                       })
            }
        })
    })
}

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