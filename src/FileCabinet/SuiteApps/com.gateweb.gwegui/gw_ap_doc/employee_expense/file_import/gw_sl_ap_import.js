define([
  'N/https',
  'N/ui/serverWidget',
  'N/record',
  'N/task',
  'N/url',
  '../../application/gw_service_ap_doc_apply_period',
  './gw_lib_csv_task_service',
  './gw_lib_ap_csv',
  '../../application/gw_lib_wrapper',
  '../../application/gw_service_ap_doc_apply_month',
], (
  https,
  serverWidget,
  record,
  task,
  url,
  applyPeriodService,
  csvTaskService,
  csvService,
  wrapperLib,
  applyMonthService
) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   * @NScriptType Suitelet
   */
  var exports = {}

  /**
   * onRequest event handler
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {ServerRequest} context.request - The incoming request object
   * @param {ServerResponse} context.response - The outgoing response object
   */
  function onRequest(context) {
    log.audit({title: `${context.request.method} request received`})

    const eventRouter = {
      [https.Method.GET]: onGet,
      [https.Method.POST]: onPost
    }

    try {
      eventRouter[context.request.method](context)
    } catch (e) {
      onError({context: context, error: e})
    }

    log.audit({title: 'Request complete.'})
  }

  /**
   * Event handler for HTTP GET request
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {ServerRequest} context.request - The incoming request object
   * @param {ServerResponse} context.response - The outgoing response object
   */
  function onGet(context) {
    // TODO
    log.debug({
      title: 'on Get request params',
      details: context.request.parameters
    })
    var uploadForm = serverWidget.createForm({
      title: '進項發票匯入'
    })
    var applyPeriodField = uploadForm.addField({
      id: 'apply_period',
      label: '申報期別',
      type: serverWidget.FieldType.TEXT
    })
    applyPeriodField.updateBreakType({
      breakType: serverWidget.FieldBreakType.STARTROW
    })
    var applyMonthField = uploadForm.addField({
      id: 'apply_month',
      label: '申報月',
      type: serverWidget.FieldType.TEXT
    })
    var uploadField = uploadForm.addField({
      id: 'upload_file',
      label: 'Upload',
      type: serverWidget.FieldType.FILE
    })
    var transactionField = uploadForm.addField({
      id: 'transaction_id',
      label: 'Transaction',
      type: serverWidget.FieldType.SELECT,
      source: 'transaction'
    })

    var transactionTypeField = uploadForm.addField({
      id: 'transaction_type',
      label: 'TransactionType',
      type: serverWidget.FieldType.TEXT
    })
    // transactionField.isDisabled = true
    var paramTranId = context.request.parameters['transaction_id']
    var paramTranType = context.request.parameters['transaction_type']
    var paramApplyPeriod = context.request.parameters['apply_period']

    applyPeriodField.defaultValue = paramApplyPeriod
      ? paramApplyPeriod
      : applyPeriodService.convertToApplyPeriod(null)
    transactionField.defaultValue = paramTranId ? paramTranId : '107'
    transactionTypeField.defaultValue = paramTranType
    applyMonthField.defaultValue = applyMonthService.convertToApplyMonth()
    applyPeriodField.updateLayoutType({
      layoutType: serverWidget.FieldLayoutType.OUTSIDE
    })
    applyPeriodField.updateBreakType({
      breakType: serverWidget.FieldBreakType.STARTROW
    })
    applyMonthField.updateLayoutType({
      layoutType: serverWidget.FieldLayoutType.OUTSIDE
    })
    applyMonthField.updateBreakType({
      breakType: serverWidget.FieldBreakType.STARTROW
    })
    uploadField.updateLayoutType({
      layoutType: serverWidget.FieldLayoutType.OUTSIDE
    })
    uploadField.updateBreakType({
      breakType: serverWidget.FieldBreakType.STARTROW
    })

    transactionField.updateLayoutType({
      layoutType: serverWidget.FieldLayoutType.OUTSIDE
    })
    transactionField.updateBreakType({
      breakType: serverWidget.FieldBreakType.STARTROW
    })
    transactionField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.INLINE
    })

    transactionTypeField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.INLINE
    })
    uploadForm.addSubmitButton({
      label: 'Submit'
    })
    context.response.writePage(uploadForm)
  }

  /**
   * Event handler for HTTP POST request
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {ServerRequest} context.request - The incoming request object
   * @param {ServerResponse} context.response - The outgoing response object
   */
  function onPost(context) {
    // TODO
    log.debug({
      title: 'on POST request params',
      details: context.request.parameters
    })
    const transactionTypeMapping = {
      vendorbill: record.Type.VENDOR_BILL,
      expensereport: record.Type.EXPENSE_REPORT
    }
    var uploaded_file = context.request.files['upload_file']
    var applyPeriod = context.request.parameters['apply_period'] || ''
    var applyMonth = context.request.parameters['apply_month'] || ''
    var transactionId = context.request.parameters['transaction_id'] || ''
    var transactionType = context.request.parameters['transaction_type'] || ''
    var tranType = transactionTypeMapping[transactionType]
    // var fileLines = getFileContent(uploaded_file)
    // if (fileLines > 2000) {
    // submitToQueue(uploaded_file, applyPeriod, transactionId)
    // } else {
    processUploadFile(uploaded_file, applyPeriod, applyMonth, transactionId, tranType)
    // }

    redirectToExpenseRecord(context, transactionId, tranType)
  }

  function isCsvLineValid(lineText) {
    const invalidLineString = [',,,,,,,,,,,,,,,,,,,', ',,,,,,,,,,,,,,,,,,,,,,,,']
    return !(invalidLineString.indexOf(lineText.trim()) > -1 || !lineText)

  }

  function getFileContent(uploaded_file) {
    var fileContent = uploaded_file.getContents()
    var fileLines = fileContent.split('\r\n').filter(function (line) {
      return isCsvLineValid(line)
    })
    log.debug({title: 'fileLines', details: fileLines})
    return fileLines
  }

  var processUploadFile = wrapperLib.logWrapper(processUploadFileCore)

  function processUploadFileCore(
    uploaded_file,
    applyPeriod,
    applyMonth,
    transactionId,
    transactionType
  ) {
    var fileLines = getFileContent(uploaded_file)
    csvService.setApplyPeriod(applyPeriod)
    csvService.setApplyMonth(applyMonth)
    var allNsRecord = csvService.parseAllLines(fileLines)
    var validRecords = filterValidateRecord(allNsRecord)
    log.debug({
      title: 'processUploadFile validate count/record count',
      details: validRecords.length + '/' + allNsRecord.length
    })
    csvService.insertExpenseSublistLines(
      transactionId,
      validRecords,
      transactionType
    )
  }

  function filterValidateRecord(allNsRecord) {
    var validRecords = allNsRecord.filter(function (nsRecord) {
      return parseInt(nsRecord.custrecord_gw_ap_doc_status) === 1
    })
    if (csvService.getHistoryGuiNumber().length > 0) {
      validRecords = validRecords.filter(function (nsRecord) {
        return !csvService.isGuiNumberDuplicated(
          nsRecord.custrecord_gw_ap_doc_gui_num
        )
      })
    }
    return validRecords
  }

  function redirectToExpenseRecord(context, transactionId, transactionType) {
    context.response.sendRedirect({
      identifier: transactionType,
      type: https.RedirectType.RECORD,
      editMode: false,
      id: transactionId
    })
  }

  function submitToQueue(uploaded_file, applyPeriod, transactionId) {
    var fileId = saveTempFile(uploaded_file)
    csvTaskService.queueTask(applyPeriod, fileId, transactionId)
    executeMapReduceTask()
  }

  function saveTempFile(tempFile) {
    tempFile.folder = '-20'
    var fileId = tempFile.save()
    return fileId
  }

  function executeMapReduceTask() {
    var csv_import_task = task.create({
      taskType: task.TaskType.MAP_REDUCE
    })
    csv_import_task.scriptId = 'customscript_gw_mr_import_ap_csv'
    csv_import_task.deploymentId = 'customdeploy_gw_mr_import_ap_csv'
    var taskId = csv_import_task.submit()
    return taskId
  }

  /**
   * Error handler for Suitelet
   *
   * @gov XXX
   *
   * @param {Object} params
   * @param {Error} params.error - The error which triggered this handler
   * @param {Object} params.context
   * @param {ServerRequest} params.context.request - The incoming request object
   * @param {ServerResponse} params.context.response - The outgoing response object
   */
  function onError(params) {
    // TODO
    log.debug({title: 'Error Occurs', details: params.error})
  }

  exports.onRequest = onRequest
  return exports
})
