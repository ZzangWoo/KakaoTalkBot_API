//#region # 버전 관리 및 업데이트 날짜
let UpdateVersion = '(Ver 1.0.4)';
let UpdateDate = '[lastUpdate : 2020-11-08]';

//#region # 일반 명령어 정리

let NormalCommandList = '[기본 명령어]\n'
+ '1. 오늘 날씨 확인\n'
+ '예시) [/날씨 서울특별시 노원구 상계동] => 구, 동은 생략 가능\n'
+ '2. 코로나 현황 확인\n'
+ '예시) [/코로나]';

//#endregion

//#region # 구독 관련 명령어 정리

let SubscribeCommandList = '[구독 관련 명령어]\n'
+ '-----------------------------------\n'
+ '* 해당  기능은  단톡방에서\n'
+ '* 사용   불가능해요.\n'
+ '-----------------------------------\n'
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

//#region # 잔디방 관련 명령어 정리

let GitCommitRoomCommandList = '[잔디방 관련 명령어]\n'
+ '-----------------------------------\n'
+ '잔디방에서만 사용가능한 명령어에요\n'
+ '-----------------------------------\n'
+ '1. 커밋 인증\n'
+ '예시) /인증\n'
+ '2. 당일 인증내역 확인\n'
+ '예시) /인증확인\n'
+ '3. 일정기간 동안의 인증내역 확인\n'
+ '예시) /인증확인 2020-10-01 2020-10-15'
+ '4. 인증 이벤트 상태 확인\n'
+ '예시1) /인증이벤트 시작날짜 마지막날짜 인증최소횟수\n'
+ '예시2) /인증이벤트 2020-11-17 2020-11-25 2';

//#endregion

//#region # 기타 기능 명령어 정리

let ETCCommandList = '[기타 명령어]\n'
+ '1. 로또 번호 추출\n'
+ '예시) /로또추첨';

//#endregion

function returnCommandList(room) {
    console.log(room + '에서 명령어 호출');
    let wholeCommand = '*********************************\n'
    + '둥봇에게 사용 가능한 명령어\n'
    + UpdateVersion + '\n'
    + '*********************************\n\n'
    + NormalCommandList + '\n\n';
    if (!room) {
        wholeCommand += SubscribeCommandList + '\n\n';
    } else {
        if (room.indexOf('잔디') != -1) {
            wholeCommand += GitCommitRoomCommandList + '\n\n';
        } else {
            wholeCommand += SubscribeCommandList + '\n\n';
        }
    }
    
    wholeCommand += ''
    + ETCCommandList + '\n\n'
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