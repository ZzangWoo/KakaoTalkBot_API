// mssql 모듈 가져오기
const sql = require('mssql');
// DB 정보 가져오기
const config = require('../Config/dbInfo');

// 숫자야구 게임 방법
let HowToPlay_NumberBaseballGame = "[숫자야구게임 방법]\n"
+ "- 둥봇이 임의대로 정한 3자리 숫자를 맞추는 게임\n"
+ "- 숫자에 중복은 허용되지 않음\n"
+ "- 0으로도 시작할 수 있음\n"
+ "- 사용되는 숫자는 0~9\n"
+ "- 숫자는 맞지만 위치가 틀렸을 때는 볼\n"
+ "- 숫자와 위치가 전부 맞으면 스트라이크"

module.exports.HowToPlay = function(gameName) {
    let result = ""
    
    switch(gameName) {
        case "NumberBaseball":
            result += HowToPlay_NumberBaseballGame;
            break;
    }

    return result;
}

module.exports.GetNumberBaseballGameRanking = function(Nickname, RoomName) {
    return new Promise(function(resolve, reject) {
        const connection = sql.connect(config, (err) => {
            if (err) {
                console.log("[DB 연동 실패] - 숫자야구 랭킹불러오기");
				console.log(err);
            } else {
                console.log("[DB 연동 성공] - 숫자야구 랭킹불러오기");

                const request = connection.request();
                request.input('NickName', sql.NVarChar(100), Nickname)
                       .input('RoomName', sql.NVarChar(200), RoomName)
                       .execute('GetNumberBaseballGameRanking', (err, recordsets, returnValue) => {
                           if (err) {
                                console.log("[SP 연동 실패] - 숫자야구 랭킹불러오기");
                                console.log(err);
                                resolve("[둥봇 메세지]\n랭킹을 불러올 수 없습니다.");
                           } else {
                                console.log("[SP 연동 성공] - 숫자야구 랭킹불러오기");

                                if (Object.keys(recordsets.recordset).length == 0) {
                                    resolve("[둥봇 메세지]\n랭킹을 불러올 수 없습니다.");
                                } else {
                                    let resultMessage = "";

                                    resultMessage += "[숫자야구 랭킹]\n";
                                    for (var idx in recordsets.recordset) {
                                        resultMessage += (idx + 1).replace(/(^0+)/, "") + "위 ";
                                        resultMessage += recordsets.recordset[idx].NickName + " ";
                                        resultMessage += "(" + recordsets.recordset[idx].Point + "점)\n";
                                    }

                                    resolve(resultMessage.replace(/\s+$/g, ""));
                                }
                           }
                       })
            }
        })
    })
}