// mssql 모듈 가져오기
const sql = require('mssql');
// DB 정보 가져오기
const config = require('../Config/dbInfo');
// 현재 날짜, 시간을 가져오기 위한 모듈
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
// 날씨 코드 가져오기 위한 모듈 가져오기
const getWeatherCode = require('../Entity/WeatherCode');

module.exports.GetWeather = function (from, city, gu, dong) {
	return new Promise(function(resolve, reject) {
		const connection = sql.connect(config, (err) => {
			if (err) {
				console.log("[DB 연동 실패] - 좌표불러오기");
				console.log(err);
			} else {
				console.log("[DB 연동 성공] - 좌표불러오기");
	
				const request = connection.request();
				request.input('City', sql.NVarChar(50), city)
					   .input('Gu', sql.NVarChar(50), gu)
					   .execute('GetCityCoordinate', (err, recordsets, returnValue) => {
							if (err) {
								console.log("[sp 접근 실패] - 좌표불러오기");
								console.log(err);
								res.status(200).json(
									{
										"Message": "error"
									}
								);
							} else {
								console.log("[sp 접근 성공] - 좌표불러오기");
								if (Object.keys(recordsets.recordset).length == 0) {
									resolve("\n정확하지 않은 지역정보입니다.\n다시 확인하셔서\n[/날씨 서울특별시 노원구]와 같이 입력해주세요.");
									// res.status(200).json(
									// 	{
									// 		"Message": "\n정확하지 않은 지역정보입니다.\n다시 확인하셔서\n[@날씨 서울특별시 노원구]와 같이 입력해주세요."
									// 	}
									// )
								} else {
									var Coordinate_X = '';
									var Coordinate_Y = '';
		
									Coordinate_X = recordsets.recordset[0].Coordinate_X;
									Coordinate_Y = recordsets.recordset[0].Coordinate_Y;
		
									console.log(city + " " + gu + " 날씨 API 호출");
		
									var request = require('request');
		
									var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst';
		
									var queryParams = '?' + encodeURIComponent('ServiceKey') + '=wt3L6lWDNYu7bbcnV0%2F3eNqzwSygZF2X%2B9%2FU4yPWUOi5dayeP7ePFqhlp245rAwvWgpyar3keBs7mH%2Fkb9Up9Q%3D%3D';
									queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
									queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('80');
									queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON');
									queryParams += '&' + encodeURIComponent('base_date') + '='+ encodeURIComponent(moment().format('YYYYMMDD'));
									queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(getWeatherCode('WeatherTime', moment().format('HHmm')));
									queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(Coordinate_X);
									queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(Coordinate_Y);
		
									request({
										url: url + queryParams,
										method: 'GET'
									}, function (error, response, body) {
										console.log("날씨 API 호출 성공");
		
										var weatherResult = {
											"POP": "", // 강수확률 (%)
											"PTY": "", // 강수형태 (코드)
											"REH": "", // 습도 (%)
											"SKY": "", // 하늘상태 (코드)
											"T3H": "", // 현재기온 (도)
											"TMN": "", // 아침 최저기온 (도)
											"TMX": "" // 낮 최고온도 (도)
										}; 
		  
										var weatherData = JSON.parse(response.body).response.body.items.item;
		
										for (var idx in weatherData) {
											switch(weatherData[idx].category) {
												case 'POP':
													weatherResult.POP = weatherData[idx].fcstValue;
													break;
												case 'PTY':
													weatherResult.PTY = weatherData[idx].fcstValue;
													break;
												case 'REH':
													weatherResult.REH = weatherData[idx].fcstValue;
													break;
												case 'SKY':
													weatherResult.SKY = weatherData[idx].fcstValue;
													break;
												case 'T3H':
													weatherResult.T3H = weatherData[idx].fcstValue;
													break;
												case 'TMN':
													weatherResult.TMN = weatherData[idx].fcstValue;
													break;
												case 'TMX':
													weatherResult.TMX = weatherData[idx].fcstValue;
													break;
												default:
													break;
											}
										}
		
										console.log(weatherResult);
		
										var message = from + '님 께서 요청하신 날씨 정보입니다.\n';
										message += '[' + city + ' ' + gu + ' 의 날씨]\n';
										message += '현재 온도 : ' + weatherResult.T3H + '℃\n';
										message += '(' + getWeatherCode('SkyType', weatherResult.SKY) + ')\n';
										message += '최저 온도 : ' + weatherResult.TMN + '℃\n';
										message += '최고 온도 : ' + weatherResult.TMX + '℃\n';
										message += '강수확률은 ' + weatherResult.POP + '% 입니다.';
		
										resolve(message);
										// var result = {
										// 	"Message": message
										// }
		
										// res.status(200).json(result);
									});
								}
							}
					   })
			}
		});
	});
}