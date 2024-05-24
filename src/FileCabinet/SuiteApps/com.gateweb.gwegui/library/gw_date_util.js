define(['./moment-with-locales'], function (moment, config) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  var exports = {}

  function getGuiPeriod(dateTimeValue) {
    var currentDate = dateTimeValue ? moment(dateTimeValue) : moment()
    var currentYear = currentDate.year()
    var currentMonth = currentDate.month() + 1
    var applyYear = currentYear - 1911
    var applyMonth = currentMonth % 2 === 0 ? currentMonth : currentMonth + 1
    return applyYear.toString() + ('0' + applyMonth.toString()).slice(-2)
  }

  function getGracePeriod(dateTimeValue) {
    var currentDate = dateTimeValue ? moment(dateTimeValue) : moment()
    var currentYear = currentDate.year()
    var currentMonth = currentDate.month() + 1
    var currentDay = currentDate.date()
    var applyYear = currentYear - 1911
    var applyMonth =
      currentMonth % 2 === 0
        ? currentMonth
        : currentDay <= 15
        ? currentMonth - 1
        : currentMonth + 1
    if (applyMonth === 0) {
      applyMonth = applyMonth + 12
      applyYear = applyYear - 1
    }
    return applyYear.toString() + ('0' + applyMonth.toString()).slice(-2)
  }

  function getNsCompatibleDate(dateStr, dateFormat) {
    var dateObj = dateStr ? moment(dateStr) : moment().utc().utcOffset(8)
    if (!dateFormat) dateFormat = 'M/D/YYYY'
    log.debug({ title: 'dateFormat', details: dateFormat })
    return dateObj.format(dateFormat)
  }

  function getCurrentDateTime() {
    var curDateTime = moment().utc().utcOffset(8)
    return {
      date: curDateTime.format('M/D/YYYY'),
      time: curDateTime.format('HH:mm:ss'),
    }
  }

  function getCurrentDateInYYYYMMDD() {
    var curDateTime = moment().utc().utcOffset(8)
    return curDateTime.format('YYYYMMDD')
  }

  function getDateObject(dateStr) {
    return moment(dateStr)
  }

  function getDateWithFormat(dateStr, currentFormat, newFormat) {
    var currentDate = moment(dateStr, currentFormat)
    return moment(currentDate).format(newFormat)
  }

  function getDateWithFormatInYYYYMMDD(dateStr, currentDateFormat) {
    var formattedDateString = dateStr
    if(currentDateFormat !== 'M/D/YYYY') {
      formattedDateString = moment(dateStr).format('M/D/YYYY')
    }

    return moment(formattedDateString).format('YYYYMMDD')
  }

  exports.getGuiPeriod = getGuiPeriod
  exports.getGracePeriod = getGracePeriod
  exports.getNsCompatibleDate = getNsCompatibleDate
  exports.getCurrentDateTime = getCurrentDateTime
  exports.getDateObject = getDateObject
  exports.getCurrentDateInYYYYMMDD = getCurrentDateInYYYYMMDD
  exports.getDateWithFormat = getDateWithFormat
  exports.getDateWithFormatInYYYYMMDD = getDateWithFormatInYYYYMMDD
  return exports
})
