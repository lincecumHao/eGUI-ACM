require([
    'SuiteApps/com.gateweb.gwegui/library/gw_date_util.js',
    '/SuiteApps/com.gateweb.gwegui/library/gw_lib_companyConfig.js'
], (
    gwDateUtil,
    gwLibCompanyConfig
) => {
    log.debug({ title: 'Execution start...' })

    var result = gwDateUtil.getDateObject('01/22/2024')
    log.debug({ title: 'result', details: result })

    var dateFormat = gwLibCompanyConfig.getCompanyDateFormat()
    var resultDate = gwDateUtil.getDateWithFormatInYYYYMMDD('01/22/2024', dateFormat)
    log.debug({ title: 'resultDate', details: resultDate })

    log.debug({ title: 'Execution end...' })
})
