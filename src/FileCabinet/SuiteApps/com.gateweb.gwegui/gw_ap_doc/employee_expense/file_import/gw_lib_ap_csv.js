define([
  'N/format',
  'N/record',
  'N/config',
  '../../vo/gw_ap_doc_fields',
  '../../application/gw_service_ap_doc_deduct_code_options',
  '../../application/gw_service_ap_doc_status_options',
  '../../application/gw_service_ap_doc_tax_type_options',
  '../../application/gw_service_ap_doc_type_options',
  '../../application/gw_service_assign_log_track',
  '../../application/gw_service_ap_doc_apply_period',
  '../../application/gw_service_ap_doc_gui_number',
  '../../application/moment-with-locales',
  '../../application/gw_lib_wrapper',
  '../../application/gw_service_ap_doc_apply_month'
], function (
  format,
  record,
  config,
  apDocFields,
  deductCodeOptionService,
  docStatusOptionService,
  taxTypeOptionService,
  docTypeOptionService,
  assignLogTrackService,
  applyPeriodService,
  guiNumService,
  moment,
  wrapperLib,
  applyMonthService
) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var numberWithThousandSeparatorRegEx = /"[0-9]{1,3}(,[0-9]{3})*"/
  var headerCols = {}
  var csvColNsFieldIdMapping = {
    0: 'custrecord_gw_ap_doc_gui_num',
    1: 'custrecord_gw_ap_doc_deduct_code',
    2: 'custrecord_gw_ap_doc_type',
    3: 'custrecord_gw_ap_doc_status',
    4: 'custrecord_gw_ap_doc_issue_date',
    5: 'custrecord_gw_ap_doc_buyer_tax_id',
    6: 'custrecord_gw_ap_doc_buyer_name',
    7: 'custrecord_gw_ap_doc_seller_tax_id',
    8: 'custrecord_gw_ap_doc_seller_name',
    9: '',
    10: 'custrecord_gw_ap_doc_sales_amt',
    11: 'custrecord_gw_ap_doc_ztr_amt',
    12: 'custrecord_gw_ap_doc_exempt_amt',
    13: 'custrecord_gw_ap_doc_tax_amt',
    14: 'custrecord_gw_ap_doc_total_amt',
    15: 'custrecord_gw_ap_doc_tax_type',
    16: '',
    17: 'custrecord_gw_ap_doc_comm_num'
  }
  const transactionTypeMapping = {}
  var lines = {}
  var applyPeriod = applyPeriodService.convertToApplyPeriod(null)
  var applyMonth = null
  var companyPreference = null
  var dateFormatPreference = ''

  exports.constructor = function () {}

  function setApplyPeriod(inputValue) {
    if (inputValue) applyPeriod = inputValue
  }
  function setApplyMonth(inputValue) {
    if (inputValue) applyMonth = applyMonthService.getRecordByValue(inputValue)
  }

  function setHeaderCols(headerLine) {
    headerLine.split(',').forEach(function (headerLabel, colIdx) {
      headerCols[colIdx] = {
        colIdx: colIdx,
        colLabel: headerLabel,
        apFieldId: csvColNsFieldIdMapping[colIdx]
      }
    })
  }

  function removeThousandSeparator(formattedNumber) {
    var replaceRegEx = /("|,*)/g
    return formattedNumber.replace(replaceRegEx, '')
  }

  function reFormatApCsvLine(line) {
    while (numberWithThousandSeparatorRegEx.test(line)) {
      var formattedNumberField = numberWithThousandSeparatorRegEx.exec(line)[0]
      var numberWithoutSeparator = removeThousandSeparator(formattedNumberField)
      line = line.replace(
        numberWithThousandSeparatorRegEx,
        numberWithoutSeparator
      )
    }
    return line
  }

  function parseLineCore(line, lineIndex) {
    line = reFormatApCsvLine(line)
    var lineColValuesArr = line.split(',')
    var lineColValues = {}

    lineColValuesArr.forEach(function (value, colIdx) {
      var nsFieldId = headerCols[colIdx]
        ? headerCols[colIdx].apFieldId
        : csvColNsFieldIdMapping[colIdx]
      var colLabel = headerCols[colIdx] ? headerCols[colIdx].colLabel : ''
      var lineColValueObj = {
        colIdx: colIdx,
        colValue: value,
        colLabel: colLabel,
        apFieldId: nsFieldId
      }
      lineColValues[colIdx] = lineColValueObj
    })
    var apDocRecordObj = updateCommonNumber(
      updateDocType(updateAmount(convertCsvLineToApRecord(lineColValues)))
    )
    if (lineIndex) {
      apDocRecordObj['csvLine'] = lineIndex
    }
    return apDocRecordObj
  }

  function updateAmountCore(nsRecordObj) {
    var taxTypeValue = taxTypeOptionService.getTaxTypeValueByRecordId(
      nsRecordObj[apDocFields.fields.taxType.id]
    )
    var salesAmt = parseInt(nsRecordObj[apDocFields.fields.salesAmt.id]) || 0
    var taxExemptSalesAmt =
      parseInt(nsRecordObj[apDocFields.fields.taxExemptedSalesAmt.id]) || 0
    var zeroTaxSalesAmt =
      parseInt(nsRecordObj[apDocFields.fields.zeroTaxSalesAmt.id]) || 0
    var taxAmt = parseInt(nsRecordObj[apDocFields.fields.taxAmt.id]) || 0
    var totalAmt = parseInt(nsRecordObj[apDocFields.fields.totalAmt.id]) || 0
    nsRecordObj[apDocFields.fields.salesAmt.id] = salesAmt
    nsRecordObj[apDocFields.fields.taxExemptedSalesAmt.id] = taxExemptSalesAmt
    nsRecordObj[apDocFields.fields.zeroTaxSalesAmt.id] = zeroTaxSalesAmt
    nsRecordObj[apDocFields.fields.taxAmt.id] = taxAmt
    nsRecordObj[apDocFields.fields.totalAmt.id] = totalAmt

    if (taxTypeOptionService.isTaxExempt(taxTypeValue)) {
      nsRecordObj[apDocFields.fields.taxExemptedSalesAmt.id] = salesAmt
      nsRecordObj[apDocFields.fields.zeroTaxSalesAmt.id] = 0
      nsRecordObj[apDocFields.fields.salesAmt.id] = 0
    }
    if (taxTypeOptionService.isZeroTax(taxTypeValue)) {
      nsRecordObj[apDocFields.fields.taxExemptedSalesAmt.id] = 0
      nsRecordObj[apDocFields.fields.zeroTaxSalesAmt.id] = salesAmt
      nsRecordObj[apDocFields.fields.salesAmt.id] = 0
    }

    return nsRecordObj
  }

  function updateDocTypeCore(nsRecordObj) {
    var docTypeCsvValue = nsRecordObj[apDocFields.fields.docType.id]
    var guiNumberObj = guiNumService.parseEguiNumber(
      nsRecordObj[apDocFields.fields.guiNum.id]
    )
    var applyPeriod = applyPeriodService.convertGuiPeriod(
      nsRecordObj[apDocFields.fields.guiDate.id]
    )
    var assignLogRecords = assignLogTrackService.getRecordsByDocTypeGuiTrackAndApplyPeriod(
      docTypeCsvValue,
      guiNumberObj.track,
      applyPeriod
    )
    var mofDocTypeCode = '00'
    if (assignLogRecords && assignLogRecords.length > 0) {
      mofDocTypeCode = assignLogRecords[0].mofDocType
    }
    if (docTypeCsvValue === '25' && mofDocTypeCode === '00') {
      // TODO: POTENTIAL ISSUE
      mofDocTypeCode = '07'
    }
    if (docTypeCsvValue === '21' && mofDocTypeCode === '00') {
      // TODO: POTENTIAL ISSUE
      mofDocTypeCode = '05'
    }
    if (docTypeCsvValue === '22' && mofDocTypeCode === '00') {
      // TODO: POTENTIAL ISSUE
      mofDocTypeCode = '03'
    }
    var docTypeNsId = docTypeOptionService.getApDocTypeIdByValueAndInvoiceCode(
      docTypeCsvValue,
      mofDocTypeCode
    )
    nsRecordObj[apDocFields.fields.docType.id] = docTypeNsId

    return nsRecordObj
  }

  function updateCommonNumberCore(nsRecordObj) {
    var guiNumber = nsRecordObj[apDocFields.fields.guiNum.id]
    if (guiNumber !== '' && guiNumber !== null) {
      nsRecordObj[apDocFields.fields.commonNumber.id] = ''
    }
    return nsRecordObj
  }

  function convertCsvLineToApRecordCore(csvLineObj) {
    var recordObj = {}
    Object.keys(csvLineObj).forEach(function (colIndex) {
      var colObj = csvLineObj[colIndex]
      if (colObj.apFieldId) {
        recordObj[colObj.apFieldId] = convertCsvColValue(colObj)
      }
    })
    recordObj[apDocFields.fields.applyPeriod.id] = applyPeriod
    recordObj[
      apDocFields.fields.applyPeriodSelect.id
    ] = applyPeriodService.getRecordByValue(applyPeriod).id
    recordObj[apDocFields.fields.applyMonthSelect.id] = applyMonth
    return recordObj
  }

  function extractCommonNumber(colValue) {
    var commonNumberRegEx = /BB\d{8}/
    var result = ''
    if (commonNumberRegEx.test(colValue))
      result = commonNumberRegEx.exec(colValue)[0]
    return result
  }

  function convertCsvColValueCore(colObj) {
    var nsValue = colObj.colValue
    switch (colObj.apFieldId) {
      case apDocFields.fields.taxType.id:
        nsValue = taxTypeOptionService.getTaxTypeRecordIdByCsvValue(
          colObj.colValue
        )
        break
      case apDocFields.fields.guiStatus.id:
        nsValue = docStatusOptionService.getStatusIdByCsvValue(colObj.colValue)
        break
      case apDocFields.fields.deductionCode.id:
        nsValue = deductCodeOptionService.getDeductionCodeRecordIdByCsvValue(
          colObj.colValue
        )
        break
      case apDocFields.fields.commonNumber.id:
        nsValue = extractCommonNumber(colObj.colValue)
        break
      case apDocFields.fields.guiDate.id:
        var dateFormat = getDateFormatPreference()
        var nsValue = moment(colObj.colValue).format(dateFormat)
        break
      default:
        break
    }
    return nsValue
  }

  function getDateFormatPreference() {
    if (!dateFormatPreference) {
      var companyPreference = config.load({
        type: config.Type.COMPANY_PREFERENCES
      })
      dateFormatPreference = companyPreference.getValue({
        fieldId: 'DATEFORMAT'
      })
    }
    return dateFormatPreference
  }

  var apDocRecordTypeId = 'customrecord_gw_ap_doc'
  var apDocSublistId = 'recmachcustrecord_gw_apt_doc_tran_id'

  function insertExpenseSublistLinesCore(recordId, nsRecordArr, tranType) {
    var transactionRecord = record.load({
      type: tranType,
      isDynamic: true,
      id: recordId
    })

    nsRecordArr.forEach(function (nsObj) {
      var nsRecordObj = getNsRecordObj(nsObj)
      transactionRecord = setSublistValues(transactionRecord, nsRecordObj)
    })
    transactionRecord.save({
      ignoreMandatoryFields: true,
      enableSourcing: false
    })
  }

  function getNsRecordObj(nsObj) {
    if (typeof nsObj === 'string') {
      return JSON.parse(nsObj)
    }
    return nsObj
  }

  function setSublistValues(transactionRecord, nsRecordObj) {
    transactionRecord.selectNewLine({
      sublistId: apDocSublistId
    })
    var ignoreFields = [apDocFields.fields.transaction.id, 'csvLine']
    Object.keys(nsRecordObj).forEach(function (fieldId) {
      if (ignoreFields.indexOf(fieldId) === -1) {
        var fieldValue = nsRecordObj[fieldId]
        if (fieldId === apDocFields.fields.guiDate.id) {
          fieldValue = format.parse({
            value: fieldValue,
            type: format.Type.DATE
          })
        }
        transactionRecord.setCurrentSublistValue({
          sublistId: apDocSublistId,
          fieldId: fieldId,
          value: fieldValue
        })
      }
    })
    transactionRecord.commitLine({
      sublistId: apDocSublistId
    })
    return transactionRecord
  }

  function isGuiNumberDuplicated(guiNumber) {
    return guiNumService.isGuiNumberDuplicate(guiNumber)
  }

  function getHistoryGuiNumber() {
    return guiNumService.getAllGuiNumber()
  }

  function parseAllLinesCore(csvLines) {
    var allLineNsObj = []
    csvLines.forEach(function (csvLine, index) {
      if (index === 0) {
        setHeaderCols(csvLine)
      } else {
        var nsObj = parseLine(csvLine, index)
        if (nsObj) allLineNsObj.push(nsObj)
      }
    })
    return allLineNsObj
  }

  var parseAllLines = parseAllLinesCore
  var insertExpenseSublistLines = insertExpenseSublistLinesCore
  var convertCsvColValue = convertCsvColValueCore
  var convertCsvLineToApRecord = convertCsvLineToApRecordCore
  var updateCommonNumber = updateCommonNumberCore
  var updateDocType = updateDocTypeCore
  var updateAmount = updateAmountCore
  var parseLine = wrapperLib.logWrapper(parseLineCore)

  exports.setHeaderCols = setHeaderCols
  exports.setApplyPeriod = setApplyPeriod
  exports.setApplyMonth = setApplyMonth
  exports.removeThousandSeparator = removeThousandSeparator
  exports.reFormatApCsvLine = reFormatApCsvLine
  exports.parseLine = parseLine
  exports.parseAllLines = parseAllLines
  exports.insertExpenseSublistLines = insertExpenseSublistLines
  exports.isGuiNumberDuplicated = isGuiNumberDuplicated
  exports.headerColumns = headerCols
  exports.getHistoryGuiNumber = getHistoryGuiNumber
  return exports
})
