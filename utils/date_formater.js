module.exports.format_month = format_month
module.exports.format_week = format_week
module.exports.add_date_prefix = add_date_prefix

function format_week(week){
	switch(week){
		case 0:
			return "SUN"
		case 1:
			return "MON"
		case 2:
			return "TUE"
		case 3:
			return "WED"
		case 4:
			return "THU"
		case 5:
			return "FRI"
		case 6:
			return "SAT"

	}
}

function format_month(month) {
	switch(month){
		case 0:
			return 'January'
		case 1:
			return 'February'
		case 2:
			return 'March'
		case 3:
			return 'April'
		case 4:
			return 'May'
		case 5:
			return 'June'
		case 6:
			return 'July'
		case 7:
			return 'August'
		case 8:
			return 'September'
		case 9:
			return 'October'
		case 10:
			return 'November'
		case 11:
			return 'December'

	}
}

function add_date_prefix(day) {
	if (day < 10) {
		return '0' + day
	} else {
		return day
	}
} 
