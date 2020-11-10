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

    

    console.log("시간 : " + new Date());

    let StartDate = '2020-11-09';
    let EndDate = '2020-11-10';

    GitCommitLogSelect(StartDate, EndDate).then(function(resultMessage) {
        res.status(200).json(
            {
                "Message": resultMessage
            }
        )
    })
})


function GitCommitLogSelect(StartDate, EndDate) {

    return new Promise(function(resolve, reject) {
        const connection = sql.connect(config, (err) => {
            if (err) {
                console.log("[DB 연동 실패]");
                console.log(err);
            } else {
                console.log("[DB 연동 성공]");

                const request = connection.request();
                request.input('StartDate', sql.NVarChar(50), StartDate)
                       .input('EndDate', sql.NVarChar(50), EndDate)
                       .execute('GitCommitLogSelect', (err, recordsets, returnValue) => {
                           if (err) {
                               console.log('[sp 접근 실패]');
                               console.log(err);
                           } else {
                               console.log("[sp 접근 성공]");

                               if (recordsets.recordset.length == 0) {
                                   console.log(recordsets);
                                   resolve("[검색 실패]\n해당 기간에는 인증 데이터가 없어요");
                                   return;
                               }

							   let resultMessage = '';
							   let dateCriteria = '';

                               for (var idx in recordsets.recordset) {
								   if (dateCriteria != recordsets.recordset[idx].CertifiedDate) {
									   dateCriteria = recordsets.recordset[idx].CertifiedDate;
									   
									   resultMessage += '[' + recordsets.recordset[idx].CertifiedDate + ' 리스트]\n';
									   resultMessage += '닉네임 : ' + recordsets.recordset[idx].UserName + '\n';
                                   	   resultMessage += '인증시간 : ' + recordsets.recordset[idx].CertifiedDate + '\n\n';
								   	} else {
										resultMessage += '닉네임 : ' + recordsets.recordset[idx].UserName + '\n';
                                   		resultMessage += '인증시간 : ' + recordsets.recordset[idx].CertifiedDate + '\n\n';
									}
                               }

                               console.log(resultMessage);

                               resolve(resultMessage)
                           }
                       });
            }
        });
    });

}

function CompareCommitStatus(UserName) {

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

                               if (recordsets.recordset.length == 0) {
                                   console.log(recordsets)
                                   resolve("[인증 실패]\n" + UserName + "님의 아이디에 대한 Github Profile URL이 존재하지 않습니다.");
                                   return;
                               }

                               let GitURL = recordsets.recordset[0].GitURL;

                               const getGitHtml = async () => {
                                    try {
                                        return await axios.get(GitURL, {
											headers: {
												'Set-Cookie': 'tz=Asia%2FSeoul'
											}}, {
												withCredentials: true											
										});
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
                        
                                    console.log(list);

                                    let Message = "";
                                    if (list.count > 0) {
                                        const logRequest = connection.request();
                                        logRequest.input('UserName', sql.NVarChar(50), UserName)
                                                  .execute('GitCommitLogInsert', (err, recordsets, returnValue) => {
                                                      if (err) {
                                                          console.log("[Git Log Insert 실패]");
                                                          console.log(err);
                                                      } else {
                                                          console.log("[Git Log Insert 성공]");

                                                          let logInsertResult = recordsets.recordset[0].Result;

                                                          if (logInsertResult == "exist") {
															  Message = "[인증 실패]\n";
															  Message += UserName + "님 이미 인증했어요.(씨익)(씨익)"
                                                              resolve(Message);
                                                          } else if (logInsertResult == "success") {
                                                              Message = "[인증 성공]\n";
                                                              Message += UserName + "님 오늘 하루도 수고하셨어요.(뽀뽀)(뽀뽀)";
                                                              resolve(Message);
                                                          }
                                                      }
                                                  })
                                    } else {
                                        Message = "[인증 실패]\n";
                                        Message += UserName + "님 단톡방에 등록한 GitHub Profile URL 및 Push가 제대로 되었는지 확인해주세요.";
                                        resolve(Message);
                                    }
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