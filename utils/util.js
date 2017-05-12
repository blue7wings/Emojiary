let Polycal = require('polycal.js')
let storage = require('data_storage.js')
let date_formater = require('date_formater.js')

module.exports.get_emojis = get_emojis
module.exports.get_date = get_date
module.exports.get_emotion_value = get_emotion_value
module.exports.get_emoji_pos = get_emoji_pos
module.exports.is_newbee = is_newbee




function get_prev_month_remain_days(calendar, year, month) {
	let this_month = calendar.find(year, month)['days']
    let first_day = this_month[0]

	if(month - 1 < 0) {
		year = year - 1
		month = 11
	} else {
		month = month - 1
	}
	let prev_month = calendar.find(year, month)['days']
	let prev_month_length = prev_month.length
    let remain_days = prev_month.slice(prev_month_length - first_day['day'], prev_month_length)
	return remain_days

}

function get_next_month_remain_days(calendar, year, month) {
	let this_month = calendar.find(year, month)['days']
    let last_day = this_month[ this_month.length - 1]
	
	if(month + 1 > 11) {
		year = year + 1
		month = 0
	} else {
		month = month + 1
	}
	let next_month = calendar.find(year, month)['days']
    let remain_days = next_month.slice(0, 6 - last_day['day']) 
	return remain_days

}

function get_date(year, month) {
	    var data = []
		let date = new Date()
 
        let calendar = new Polycal({ 
            'start': {'year': year - 2, 'month': month}
        })

		// 今天的年月日
		let now_date = date.getDate()
		let now_month = date.getMonth()
		let now_year = date.getFullYear()

        let this_month = calendar.find(year, month)['days']

        // 计算第一天前面还有几天上个月的日期
        let remain_prev_month_days = get_prev_month_remain_days(calendar, year, month)

        // 计算最后一天还有几天下个月的日期
        let remain_next_month_days = get_next_month_remain_days(calendar, year, month)

        // {'key':'2017-04-11', 'enabled': 1, 'today': 1, 'day': 11}
		// 上一个月数据
        for(var i = 0; i < remain_prev_month_days.length; i++) {
            let _year = year
            let _month = date_formater.add_date_prefix(month)
            let _date = date_formater.add_date_prefix(remain_prev_month_days[i]['date'])
            let _key = _year + '-' + _month + '-' + _date
            let _data = {}
            _data = {
					'key': _key,
					'emotion_value': false,
                    'enabled': 0,
                    'today': 0,
                    'date': remain_prev_month_days[i]['date']
            }
            data.push(_data)
        }
		// 本月数据
        for (var i = 0; i < this_month.length; i++) {
            let _year = year
            let _month = date_formater.add_date_prefix(month + 1)
            let _date = date_formater.add_date_prefix(this_month[i]['date'])
            let _key = _year + '-' + _month + '-' + _date
            let _data = {}
            let _today = calendar.today()['date']
			var emotion_value = false

            var today = 0
            if(now_date == this_month[i]['date'] && now_month == this_month[i]['month'] && now_year == this_month[i]['year']) {
                today = 1;
            } 
			let item = storage.get(_key)
			if(item) {
				emotion_value = get_emotion_value(item['emoji_type'])
			}  else {
				emotion_value = false
			}
            _data = {
					'key': _key,
					'emotion_value': emotion_value,
                    'enabled': 1,
                    'today': today,
                    'date': this_month[i]['date']
            }
            data.push(_data)
            
        }
		// 下一个月数据
        for(var i = 0; i < remain_next_month_days.length; i++) {
            let _year = year
            let _month = date_formater.add_date_prefix(month + 2)
            let _date = date_formater.add_date_prefix(remain_next_month_days[i]['date'])
            let _key = _year + '-' + _month + '-' + _date
            let _data = {}
            _data= {
					'key': _key,
					'emotion_value': false,
                    'enabled': 0,
                    'today': 0,
                    'date': remain_next_month_days[i]['date']
            }
            data.push(_data)
        }

		return data
}


function get_emojis() {
	let emojis = {
		positive: [
		'anguished-face', 
		'face-with-stuck-out-tongue-and-winking-eye',
		'drooling-face',
		'face-savouring-delicious-food',
		'face-throwing-a-kiss',
		'face-with-stuck-out-tongue-and-tightly-closed-eyes',
		'face-with-stuck-out-tongue',
		'face-with-tears-of-joy',
		'flushed-face',
		'grimacing-face',
		'grinning-face-with-smiling-eyes',
		'grinning-face',
		'hugging-face',
		'hushed-face',
		'kissing-face-with-closed-eyes',
		'kissing-face-with-smiling-eyes',
		'kissing-face',
		'money-mouth-face',
		'nerd-face',
		'persevering-face',
		'relieved-face',
		'rolling-on-the-floor-laughing',
		'slightly-smiling-face',
		'smiling-face-with-halo',
		'smiling-face-with-heart-shaped-eyes',
		'smiling-face-with-open-mouth-and-cold-sweat',
		'smiling-face-with-open-mouth-and-smiling-eyes',
		'smiling-face-with-open-mouth-and-tightly-closed-eyes',
		'smiling-face-with-open-mouth',
		'smiling-face-with-smiling-eyes',
		'smiling-face-with-sunglasses',
		'smirking-face',
		'thinking-face',
		'upside-down-face',
		'white-smiling-face',
		'winking-face'
		],
		negative: [ 
		'angry-face', 
		'astonished-face', 
		'confounded-face', 
		'crying-face', 
		'disappointed-but-relieved-face', 
		'disappointed-face', 
		'dizzy-face',
		'face-screaming-in-fear',
		'face-with-cold-sweat',
		'face-with-head-bandage',
		'face-with-look-of-triumph',
		'face-with-medical-mask',
		'face-with-thermometer',
		'fearful-face',
		'imp',
		'loudly-crying-face',
		'nauseated-face',
		'pensive-face',
		'pouting-face',
		'slightly-frowning-face',
		'smiling-face-with-horns',
		'sneezing-face',
		'tired-face',
		'weary-face',
		'white-frowning-face',
		'worried-face'
		
		],
		neutral: [ 
		'confused-face', 
		'expressionless-face',
		'face-with-open-mouth-and-cold-sweat',
		'face-with-open-mouth',
		'face-with-rolling-eyes',
		'face-without-mouth',
		'frowning-face-with-open-mouth',
		'lying-face',
		'neutral-face',
		'sleeping-face',
		'sleepy-face',
		'unamused-face',
		'zipper-mouth-face'
		]
	}

	return emojis
}

function get_emotion_value(emoji_type){
	let emojis = get_emojis()
	if(emojis['positive'].indexOf(emoji_type) > 0) {
		return 'positive'
	}

	if(emojis['neutral'].indexOf(emoji_type) > 0) {
		return 'neutral'
	}

	if(emojis['negative'].indexOf(emoji_type) > 0) {
		return 'negative'
	}

	return 'neutral'
}

// 寻找指定emoji所在的位置
function get_emoji_pos(emoji_type) {
	var type_index = 0
	var emoji_index = 0
	let emotion_value = get_emotion_value(emoji_type)
	let emojis = get_emojis()

	if(emotion_value == 'negative') {
		type_index = 0
	}
	if(emotion_value == 'positive') {
		type_index = 1
	}
	if(emotion_value == 'neutral') {
		type_index = 2
	}

	for (var i = 0; i < emojis[emotion_value].length; i ++) {
		if(emojis[emotion_value][i] == emoji_type) {
			emoji_index = i
			break
		}
	}

	return [type_index, emoji_index]

}

// 判断是不是一次使用
function is_newbee(){
	if(wx.getStorageSync('is_newbee')) {
		return false
	}

    wx.setStorageSync('is_newbee', 'Your are not a Newbee')
	return true
}

