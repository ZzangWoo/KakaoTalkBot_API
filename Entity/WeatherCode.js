var RainType = {
    "0": "없음",
    "1": "비",
    "2": "비/눈",
    "3": "눈",
    "4": "소나기",
    "5": "빗방울",
    "6": "진눈개비",
    "7": "눈날림"
}

var SkyType = {
    "1": "맑음",
    "3": "구름많음",
    "4": "흐림"
}

function returnWeatherCode(type, code) {
    var result = '';

    switch(type) {
        case 'RainType':
            result = RainType[code];
            break;
        case 'SkyType':
            result = SkyType[code];
            break;
        case 'WeatherTime':
            var currentTime = parseInt(code);
            if (currentTime >= 200 && currentTime < 500) {
                result = '0200';
            } else if (currentTime >= 500 && currentTime < 800) {
                result = '0500';
            } else if (currentTime >= 800 && currentTime < 1100) {
                result = '0800';
            } else if (currentTime >= 1100 && currentTime < 1400) {
                result = '1100';
            } else if (currentTime >= 1400 && currentTime < 1700) {
                result = '1400';
            } else if (currentTime >= 1700 && currentTime < 2000) {
                result = '1700';
            } else if (currentTime >= 2000 && currentTime < 2300) {
                result = '2000';
            } else {
                result = '2300';
            }
            break;
    }

    return result;
}

module.exports = returnWeatherCode;