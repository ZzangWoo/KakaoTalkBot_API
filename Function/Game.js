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