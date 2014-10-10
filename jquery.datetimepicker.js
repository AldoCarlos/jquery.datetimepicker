/**
 * DateTime Picker plugin that alters JQuery's datepicker to add hour and minutes selection
 * @version: v1.0.2
 * @author: Aldo Junior Carlos(https://github.com/AldoCarlos/jquery.datetimepicker/)
 *
 * Based on
 * http://jonthornton.github.com/jquery-timepicker/
 * http://jqueryui.com/datepicker/
 */
(function ($) {
    $.fn.datetimepicker = function (options) {
        options = $.extend({}, options);
        options.showButtonPanel = true;
        options.showTime = true;
        return this.datepicker(options);
    };
    $.datepicker._selectDateOverload = $.datepicker._selectDate;
    $.datepicker._selectDate = function (id, dateStr) {
        var target = $(id);
        var inst = this._getInst(target[0]);
        var showTime = this._get(inst, 'showTime');
        if (showTime) {/*Don't hide the date picker when clicking a date*/
            inst.inline = true;
            $.datepicker._selectDateOverload(id, dateStr);
            inst.inline = false;
            $.datepicker._updateDatepicker(inst);
        } else {
            $.datepicker._selectDateOverload(id, dateStr);
        }
    };
    var _updateDatepicker = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function (inst) {
        _updateDatepicker.apply(this, arguments);
        var showTime = this._get(inst, 'showTime');
        if (showTime) {
            var table = inst.dpDiv.find('table:last');
            var tbody = table.find('tbody>tr:first');
            var numRows = tbody.parent().children('tr').length;
            var divHour = $('<div/>').css({ 'margin': 10, 'text-align': 'center' }).insertAfter(table);
            $('<span>Hora: </span>').css({ 'font-weight': 'bold' }).appendTo(divHour);
            var hora = $('<input/>').attr({ 'maxlength': 5, 'size': 5, 'placeholder': ' __:__'}).appendTo(divHour);
            if (inst.currentTime) hora.val(inst.currentTime);
            hora.timepicker({ 'appendTo': inst.dpDiv, 'scrollDefault': 'now', 'timeFormat': 'H:i' }).on('changeTime', function () {
                inst.currentTime = $(this).val();
                if (inst.input) {
                    inst.input.val($.datepicker._formatDate(inst));
                    $.datepicker._updateAlternate(inst);
                }
            });
        }
    };
    $.datepicker._setDateFromFieldOverride = $.datepicker._setDateFromField;
    $.datepicker._setDateFromField = function(inst, noDefault) {
        $.datepicker._setDateFromFieldOverride(inst, noDefault);
        inst.currentTime = inst.input.val().split(" ")[1];        
    };
    $.datepicker._formatDateOverload = $.datepicker.formatDate;
    $.datepicker.formatDate = function (format, date, settings) {
        var ret = this._formatDateOverload(format, date, settings);
        var inst = $.datepicker._curInst;
        if (inst) {
            var showTime = this._get(inst, 'showTime');
            if (showTime) {
                if (inst.currentTime) ret += " " + inst.currentTime;
            }
        }
        return ret;
    };
    $.datepicker._hideDatepickerOverload = $.datepicker._hideDatepicker;
    $.datepicker._hideDatepicker = function (input) {
        this._hideDatepickerOverload(input);
        var inst = $.datepicker._curInst;
        if (inst) inst.currentTime = null;
    }
    $.datepicker._gotoToday = function (id) {
        var target = $(id);
        var inst = this._getInst(target[0]);
        var showTime = this._get(inst, 'showTime');
        if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
            inst.selectedDay = inst.currentDay;
            inst.drawMonth = inst.selectedMonth = inst.currentMonth;
            inst.drawYear = inst.selectedYear = inst.currentYear;
        }
        else {
            var date = new Date();
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            inst.currentTime = this._getTimeText(inst, date.getHours(), date.getMinutes());
            this._setDateDatepicker(target, date);
            this._selectDateOverload(id, this._getDateDatepicker(target));
        }
        this._notifyChange(inst);
        this._adjustDate(target);
    }
    $.datepicker._getTimeText = function (inst, h, m) {
        if (this._get(inst, 'clockType') == 12) {
            var h2 = (h == 0 || h == 12 ? 12 : h >= 12 ? h - 12 : h);
            return (h2 < 10 ? '0' + h2 : h2) + ':' + (m < 10 ? '0' + m : m) + ' ' + (h < 12 ? ' AM' : ' PM');
        }
        else {
            return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
        }
    };
})(jQuery);