let app = getApp()
Page({
	data: {
		emoji_url : '/asset/emojis/slightly-smiling-face.svg'
	},
	onLoad: function () {
		let emojis = app.emojis
		let positive_emojis = emojis['positive']
		let emoji_name = positive_emojis[Math.floor(Math.random() * positive_emojis.length)]
		this.setData({
			emoji_url : '/asset/emojis/' + emoji_name + '.svg'
		})
		console.log(this.data.emoji_url)
		wx.login({
			success: function (data) {
				let app_id = 'wx9c587a96c5c6c68e'
				let app_secret = 'fb7e4a5d08cc42ded99fe8050b00a004'
				let url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+app_id+'&secret='+app_secret+'&js_code='+data.code+'&grant_type=authorization_code'
				// 注意：在小程序项目->request合法域名 配置项中
				// 一定要把 https://api.weixin.qq.com 添加进去
				wx.request({
					url: url,
					success: function(res){
						app.openid = res.data.openid
					}
				})
				wx.getUserInfo({
					success: function (res) {
						let user_info = res['userInfo']
						app.nickname = user_info['nickName']
						app.avatar_url = user_info['avatarUrl']
					},
					fail: () => {
						app.nickname = '未知用户'
						app.avatar_url = '/asset/images/default-avatar.png'
					},
					complete: () => {
						// 一秒后跳转到主页面
						setTimeout(() => {
							console.log('jump')
							wx.redirectTo({
								url: '/pages/home/index'
							})
						}, 1000)
					}
			})
		  }
      })
  	},
})
