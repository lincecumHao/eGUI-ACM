define([
    './moment-with-locales',
    'N/record',
    './gw_lib_search',
    './gw_lib_wrapper',
    'N/search'
], function (
    moment,
    record,
    GwSearch,
    wrapperLib,
    search
) {
    /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @copyright 2024 Gateweb
     * @author Chesley Lo
     *
     * @NApiVersion 2.0
     * @NModuleScope Public

     */
    var exports = {}

    function convertToApplyMonth(dateTimeValue) {
        var currentDate = dateTimeValue ? moment(dateTimeValue) : moment()
        var currentYear = currentDate.year()
        var currentMonth = currentDate.month() + 1
        var currentDay = currentDate.date()
        var applyYear = currentYear - 1911

        log.debug({
            title: 'convertToApplyMonth',
            details: {
                currentDate,
                currentYear,
                currentMonth,
                currentDay,
                applyYear
            }
        })

        return applyYear.toString() + ('0' + currentMonth.toString()).slice(-2)
    }

    function getRecordByValue(applyMonth) {
        var searchFilters = []
        searchFilters.push(['custrecord_gw_apply_month_value', 'is', applyMonth])
        var searchColumns = []
        searchColumns.push('name')
        searchColumns.push('custrecord_gw_apply_month_value')
        searchColumns.push('custrecord_gw_apply_month_year')
        searchColumns.push('custrecord_gw_apply_month_month')

        var customrecord_gw_apply_month_optionsSearchObj = search.create({
            type: 'customrecord_gw_apply_month_options',
            filters: searchFilters,
            columns: searchColumns
        });
        var recordId = null
        customrecord_gw_apply_month_optionsSearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            recordId = result.id
            return true;
        });

        return recordId
    }

    exports.convertToApplyMonth = convertToApplyMonth;
    exports.getRecordByValue = getRecordByValue;

    return exports
})
