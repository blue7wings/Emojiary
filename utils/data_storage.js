let Polycal = require('polycal.js')
let date_formater = require('date_formater.js')

module.exports.add = add
module.exports.get = get
module.exports.all = all
module.exports.del = del

function add(key, emoji_type, weather_code, lat, lgt, text) {
    let json_data = {
        'emoji_type': emoji_type,
        'weather_code': weather_code,
        'lat': lat,
        'lgt': lgt,
        'text': text
    }    

    wx.setStorageSync(key, JSON.stringify(json_data))
}

function get(key) {
    let json_str = wx.getStorageSync(key)
    if(json_str) {
        return JSON.parse(json_str)
    } else {
        return false
    }
}

function all(year, month) {
   let res = wx.getStorageInfoSync()
   var data = []

   let date = new Date()
   let now_year = date.getFullYear()
   let now_month = date.getMonth()

   let calendar = new Polycal({ 
        'start': {'year': now_year - 2, 'month': now_month}
    })

   let start_date = year + '-' + date_formater.add_date_prefix(month + 1) + '-00'
   let end_date = year + '-' + date_formater.add_date_prefix(month + 2) + '-00'
   for(var i = 0; i < res.keys.length; i++ ) {
        let key = res.keys[i]
        // 只拿本月的数据
        if (key.localeCompare(start_date) == 1 && key.localeCompare(end_date) == -1) {
            var value = get(key)
            var cal = calendar.find(key)

            value['week'] = date_formater.format_week(cal['day'])
            value['date'] = cal['date']
            if(!value['text']) {
                value['text'] = '-'
            }             
            data.push({
                'key': key,
                'value': value
            })

        }
   }

   // 根据时间排序
   data.sort(function(a, b) {
       return -(a['key'].localeCompare(b['key']))
   })
   return data
}

function del(key) {
    wx.removeStorageSync(key)
}