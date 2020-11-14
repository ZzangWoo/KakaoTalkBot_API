// 크롤링 관련 모듈 가져오기
const axios = require("axios");
const cheerio = require("cheerio");

// 현재 날짜, 시간을 가져오기 위한 모듈
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

module.exports.GetCovid19Info = function () {
	let covid19URL = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=%EC%BD%94%EB%A1%9C%EB%82%98+%ED%99%95%EC%A7%84%EC%9E%90';
	console.log("코로나 확진자 크롤링");

	return new Promise(function(resolve, reject) {
		const getCovid19Html = async () => {
			try {
				return await axios.get(covid19URL);
			} catch (error) {
				console.error(error);
			}
		};

		getCovid19Html().then(html => {
			let covidPatientList = [];
			const $ = cheerio.load(html.data);
			const $bodyList = $("div._cs_production_type div._content div.status_today ul").children("li");

			let message = '코로나 확진자 관련 국내현황 정보입니다.\n\n'
			message += '**************\n';
			message += moment().format('YYYY-MM-DD') + '기준\n';
			message += '**************\n\n';

			/////////////// 일일확진자 정보 /////////////////
			// 국내발생
			let domesticPatient = $(".cs_production_type .status_today ul li.info_02").find("span").text();
			let domesticPatientCount = $(".cs_production_type .status_today ul li.info_02").find("em").text();

			// 해외유입
			let foreignPatient = $(".cs_production_type .status_today ul li.info_03").find("span").text();
			let foreignPatientCount = $(".cs_production_type .status_today ul li.info_03").find("em").text();
			////////////////////////////////////////////////

			//////////////// 누적확진자 정보 ////////////////
			// 확진환자
			let accumulatePatientCount = $('.cs_production_type .status_info ul li.info_01').children('p').eq(0).text();
			let accumulatePatientIncreaseCount = $('.cs_production_type .status_info ul li.info_01').find('em').eq(0).text();

			// 검사중
			let examinationPatientCount = $('.cs_production_type .status_info ul li.info_02').find('p').text();
			let examinationPatientIncreaseCount = $('.cs_production_type .status_info ul li.info_02').find('p').text();

			// 격리해제
			let quarantineReleasePatientCount = $('.cs_production_type .status_info ul li.info_03').find('p').text();
			let quarantineReleasePatientIncreaseCount = $('.cs_production_type .status_info ul li.info_03').find('p').text();

			// 사망자
			let deathPatientCount = $('.cs_production_type .status_info ul li.info_04').children('p').eq(0).text();
			let deathPatientIncreaseCount = $('.cs_production_type .status_info ul li.info_04').children('em').eq(0).text();

			////////////////////////////////////////////////

			// 메세지 생성
			message += '[일일확진자]\n';
			message += domesticPatient + ' : ' + domesticPatientCount + '명\n';
			message += foreignPatient + ' : ' + foreignPatientCount + '명\n';
			message += '총원 : ' + (parseInt(domesticPatientCount) + parseInt(foreignPatientCount)) + '명';

			message += '\n\n';
			message += '[누적확진자]\n';
			message += '확진환자 : ' + accumulatePatientCount + '(+' + accumulatePatientIncreaseCount + ')\n';
			message += '사망자 : ' + deathPatientCount + '(+' + deathPatientIncreaseCount + ')';

			// $bodyList.each(function(i, elem) {
			// 	covidPatientList[i] = {
			// 		title: $(this).find('info_title').text(),
			// 		num: $(this).find('info_num').text()
			// 	}
			// });

			// const data = covidPatientList.filter(n => n.title);

			resolve(message);
		})
	});
}