(function(root, factory){

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.Polycal = factory();
    }

})(this, function(){


    var
        now         = new Date(),
        year        = now.getFullYear(),
        month       = now.getMonth(),
        date        = now.getDate();


    //==================================
    // Utility Functions
    //==================================

    // Extend given object with any number of additional objects.

    function extend(obj) {
        var ext = Array.prototype.slice.call(arguments, 1), val, i, l, key;
        for (i=0, l=ext.length; i<l; i++) {
            if (!!ext[i] && typeof ext === 'object') {
                for (key in ext[i]) {
                    if (ext[i].hasOwnProperty(key)) {
                        val = ext[i][key];
                        obj[key] = val;
                    }
                }
            }
        }
        return obj;
    }


    // Conform date query to standard query object from ISO8601 string or YYYY,MM,DD args.

    function parseDateQuery() {
        if (arguments.length === 1 && typeof arguments[0] === 'string' && (arguments[0].length === 10 || arguments[0].length === 7)) {
            return makeQuery(arguments[0].split('-'), true);
        } else if ((arguments.length === 2 || arguments.length === 3) && argsAreNumbers(arguments)) {
            return makeQuery(arguments, false);
        } else {
            throw new Error('Unable to parse date. Please use ISO8601 formatting, i.e. YYYY-MM-DD. Or pass YYYY, MM, DD as arguments');
        }
    }


    // Helper functions for date query parsing.

    function makeQuery(arr, rezero) {
        return {
            year: +arr[0],
            month: rezero ? +arr[1] - 1 : +arr[1],
            day: +arr[2]
        };
    }

    function argsAreNumbers(arr) {
        for (var i=0, l=arr.length; i<l; i++) {
            if (typeof arr[i] !== 'number') return false;
        }
        return true;
    }


    //==================================
    // Global
    //==================================

    function Polycal(options) {
        if (!(this instanceof Polycal)) return new Polycal(options); // Allow instantiation without 'new'.
        var config = (!!options && typeof options === 'object') ? extend({}, this.defaults, options) : this.defaults;
        this.model = [];
        this.init(config);
    }


    Polycal.prototype.defaults = {

        months: 60,

        start: {
            year: year,
            month: month
        },

        renderer: function(model) { return model; }

    };


    // Initialize with options.

    Polycal.prototype.init = function(_config) {

        var config = _config;

        for (var i=0, l=config.months; i<l; i++) {
            this.model.push(new Month(config.start.year, config.start.month + i));
        }

        //==================================
        // Days
        //==================================

        function Day(year, month, date, dayOfWeek) {
            this.year = year;
            this.month = month;
            this.date = date;
            this.day = dayOfWeek;
        }

        Day.prototype.render = function(fn) {
            return (fn && typeof fn === 'function') ? fn(this) : config.renderer(this);
        };


        //==================================
        // Months
        //==================================

        function Month(year, month) {

            var numDays     = new Date(year, (month + 1), 0).getDate(),
                dayOfFirst  = new Date(year, month, 1).getDay(),
                daysArray   = [],

                y = year + Math.floor(month/12),
                m = month % 12;

            for (var i=0; i<numDays; i++) {
                daysArray.push(new Day(y, m, i + 1, (dayOfFirst + i) % 7));
            }

            this.year = y;
            this.month = m;
            this.days = daysArray;

        }

        Month.prototype.render = Day.prototype.render;

    };


    // Take query per parseDateQuery and return month or day object.

    Polycal.prototype.find = function() {
        var q = parseDateQuery.apply(null, arguments), i, l, m;
        for (i=0, l=this.model.length; i<l; i++) {
            m = this.model[i];
            if (!q.day && m.year === q.year && m.month === q.month) return m;
            if (!!q.day && m.year === q.year && m.month === q.month && m.days[q.day - 1] !== undefined) {
                return m.days[q.day - 1];
            }
        }
        throw new Error('Unable to find date.');
    };


    // Return day object for today.

    Polycal.prototype.today = function() {
        return this.find(year,month,date);
    };


    return Polycal;


});
