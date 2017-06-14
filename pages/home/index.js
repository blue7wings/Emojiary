let app = getApp()
let util = require('../../utils/util.js')
let date_formater = require('../../utils/date_formater.js')
let storage = require('../../utils/data_storage.js')


Page({
    data: {
        'date_arr': [],
        'now_date': '2017-04-11',
        'start_date': '2015-04-11',
        'end_date': '2019-04-11',
        'date': '',
        'year': 0,
        'month': 0,
        'items': [],
        'modal_visiable': false,
        'emoji_list': [],
        'emoji_indicator': 'face-with-stuck-out-tongue-and-winking-eye',
        'emoji_defaul_value': [1, 1],
        'text': '',
        'item_key': '', //当前条目的key
        'delete_button_visiable': false ,//modal中的删除按钮是否可见
    },
    // 初始化页面数据
    page_init: function(year, month) {
        console.log(year + '-' + month + ' data had initialized')

        let data = util.get_date(year, month)

        let emojis = util.get_emojis()
        this.setData({
            'date_arr': data,
            'now_date': date_formater.format_month(month) + ' ' +year,
            'date': year + '-' + date_formater.add_date_prefix(month + 1) + '-01',
            'year': year,
            'month': month,
            'start_date': year - 2 + '-' + date_formater.add_date_prefix(month + 1) + '-01',
            'end_date': year + 2 + '-' + date_formater.add_date_prefix(month + 1) + '-01',
            'items': storage.all(year, month),
            'emoji_list': emojis['positive'],
        })

    },

    onLoad: function() {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        let emojis = util.get_emojis()

        this.page_init(year, month)
        
    },

    
    select_date: function(e) {
        let date_str = e.detail.value
        let date_arr = date_str.split('-')
        let year = parseInt(date_arr[0])
        let month = parseInt(date_arr[1]) - 1
    
        this.page_init(year, month)
    },

    prev_month: function() {
        let year = this.data.year
        let month = this.data.month

        if (month - 1 < 0) {
            year = year - 1
            month = 11
        } else {
            month = month - 1
        }

        this.page_init(year, month)
    },

    next_month: function() {
        let year = this.data.year
        let month = this.data.month

        if (month + 1 > 11) {
            year = year + 1
            month = 0
        } else {
            month = month + 1
        }

        this.page_init(year, month)
    },

    modal: function() {
        this.setData({
            'modal_visiable': true,
            'delete_button_visiable': true
        })
    },

    blank_modal: function() {
        this.setData({
            'modal_visiable': true,
            'emoji_indicator': 'face-with-stuck-out-tongue-and-winking-eye',
            'emoji_defaul_value': [1, 1],
            'text': '',
            'delete_button_visiable': false
        })

    },

    select_emoji: function(e) {
        var val = e.detail.value
        let emoji_type = val[0]
        let emoji_index = val[1]
        let emojis = util.get_emojis()
        var emoji_list = []

        if(emoji_type == 0) {
            emoji_list = emojis['negative']
        }
        if(emoji_type == 1) {
            emoji_list = emojis['positive']
        }
        if(emoji_type == 2){
            emoji_list = emojis['neutral']
        }

        this.setData({
            'emoji_list': emoji_list,
            'emoji_indicator': emoji_list[emoji_index]
        })
    },

    input : function(e) {
        this.setData({
            'text': e.detail['value']
        })
        // console.log(this.data.text)
    },
    save: function(){
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDate()
        let key = year + '-' + date_formater.add_date_prefix(month + 1)+'-' + date_formater.add_date_prefix(day)
        
        storage.add(key, this.data.emoji_indicator, 0, 0, 0, this.data.text)
        this.page_init(year, month)
        this.cancle()
    },

    delete: function() {
        storage.del(this.data.item_key)
        this.page_init(this.data.year, this.data.month)
        this.cancle()
    },

    cancle: function() {
        this.setData({
            'modal_visiable': false
        })
    },

    detail: function(e) {
        let key = e.currentTarget.dataset.key
        let item = storage.get(key)
        let emoji_defaul_value = util.get_emoji_pos(item['emoji_type'])
        this.setData({
            'text': item['text'],
            'emoji_indicator': item['emoji_type'],
            'emoji_defaul_value' : emoji_defaul_value,
            'item_key': key
        })
        this.modal()
    }

})