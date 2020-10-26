//#region # 버전 관리 및 업데이트 날짜
let UpdateVersion = '(Ver 1.0.1)';
let UpdateDate = '[lastUpdate : 2020-10-16]';

//#region # 일반 명령어 정리

let NormalCommandList = '[기본 명령어]\n'
+ '1. 오늘 날씨 확인\n'
+ '예시) [/날씨 서울특별시 노원구 상계동] => 구, 동은 생략 가능\n'
+ '2. 코로나 현황 확인\n'
+ '예시) [/코로나]';

//#endregion

//#region # 구독 관련 명령어 정리

let SubscribeCommandList = '[구독 관련 명령어]\n'
+ '1. 구독 (단톡방인 경우 구독 한 번만 가능)\n'
+ '예시) /구독\n'
+ '2. 구독취소\n'
+ '예시) /구독취소 [본인 닉네임]\n'
+ '3. 구독 가능 기능 확인\n'
+ '예시) /구독 기능 ?\n'
+ '4. 기능 구독\n'
+ '예시) /구독 기능 [기능]\n'
+ '5. 구독한 기능 취소\n'
+ '예시) /구독 기능취소 [기능]';

//#endregion

function returnCommandList() {
    let wholeCommand = '*********************************\n'
    + '둥봇에게 사용 가능한 명령어\n'
    + UpdateVersion + '\n'
    + '*********************************\n\n'
    + NormalCommandList + '\n\n'
    + SubscribeCommandList + '\n\n'
    + UpdateDate;

    return wholeCommand;
}

module.exports = returnCommandList;

/*
. 　。　　　　•　 　ﾟ　　。 .
　　.　　　.　　　 　　.　　　　　。　　 。　.
　.　　 . 。　 ඞ 。　 . •
• . ~~~님은(는) 임포스터가 아니였습니다.　 。　.
　 　　。　　　　　　ﾟ　　　.　　　　　.
,　　　　.　 .　　 . . .
*/