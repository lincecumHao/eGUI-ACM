define([
  'N/https',
  './gw_api_auth',
  'N/encode',
  '../gw_config_service',
  '../../gw_dao/settings/gw_dao_egui_config_21'
], (https, GwApiAuth, encode, GwConfigService, gwConfigDao) => {
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

   */
  let exports = {}

  var documentType = {
    INVOICE: 'invoice',
    ALLOWANCE: 'allowance'
  }

  function getHeaders() {
    var headers = {
      Accept:
        'text/html, application/json, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8, application/pdf',
      'Accept-Language': 'en-us'
    }
    log.debug({ title: 'getHeaders headers', details: headers })
    return headers
  }

  function getDownloadUrl(type) {
    // var baseUrl = GwConfigService.getDownloadBaseUrl() // 'https://nsprint.tweinv.com:443'
    var baseUrl = gwConfigDao.getConfig().downloadBaseUrl
    var typeUrlMap = {
      invoice: '/api/v1/pdf/invoice',
      allowance: '/api/v1/pdf/allowance'
    }
    if (!type) type = 'invoice'
    return `${baseUrl}${typeUrlMap[type.toLowerCase()]}`
  }

  function getPrintUrl(type) {
    // var baseUrl = GwConfigService.getPrintBaseUrl() // 'https://nsprint.tweinv.com:443'
    var baseUrl = gwConfigDao.getConfig().printBaseUrl
    var typeUrlMap = {
      invoice: '/api/v1/print/invoice',
      allowance: '/api/v1/print/allowance'
    }
    if (!type) type = 'invoice'
    return `${baseUrl}${typeUrlMap[type.toLowerCase()]}`
  }

  function getGuiStatus(filename) {
    var responseObj = {
      code: 0,
      body: ''
    }
    // var turnkeyBaseUrl = GwConfigService.getTurnkeyBaseUrl()
    var turnkeyBaseUrl = gwConfigDao.getConfig().turkeyBaseUrl
    var url = `${turnkeyBaseUrl}/v1/ns/turnkey/mig?filename=${filename}`
    // var url = `https://sstest.gwis.com.tw:443/v1/ns/turnkey/mig?filename=${filename}`
    log.debug({ title: 'getGuiStatus url', details: url })
    var headers = getHeaders()
    var authHeaders = GwApiAuth.genAuthHeader(null, null, null)
    headers = { ...headers, ...authHeaders }

    var response = https.get({
      url: url,
      headers: headers
    })
    responseObj.code = response.code
    responseObj.body = JSON.parse(response.body)
    return responseObj
  }

  function uploadGuiXml(xmlString, filename) {
    var responseObj = {
      code: 0,
      body: ''
    }
    var filenameParts = getFilenameParts(filename)
    // var turnkeyBaseUrl = GwConfigService.getTurnkeyBaseUrl()
    var turnkeyBaseUrl = gwConfigDao.getConfig().turkeyBaseUrl
    var url = `${turnkeyBaseUrl}/v1/ns/turnkey/mig?migType=${filenameParts.migType}&filename=${filenameParts.filename}`
    // var url = `https://sstest.gwis.com.tw:443/v1/ns/turnkey/mig?migType=${filenameParts.migType}&filename=${filenameParts.filename}`
    var headers = getHeaders()
    var authHeaders = GwApiAuth.genAuthHeader(null, null, null)
    headers = { ...headers, ...authHeaders }
    var response = https.post({
      url: url,
      body: xmlString,
      // body: postBody,
      headers: headers
    })
    responseObj.code = response.code
    if (response.code !== 200) {
      responseObj.body = 'Error Occurs: ' + response.body
    }
    log.debug({ title: 'uploadGuiXml responseCode', details: responseObj })

    return responseObj
  }

  function getFilenameParts(filename) {
    var fileNameRegEx = /^((\w\d+)-(\w+\d+)-\d+)(.xml)$/gm
    var regExGroupResult = fileNameRegEx.exec(filename)
    var resultObj = {
      input: regExGroupResult[0], // Original input
      filename: regExGroupResult[1], // Filename without extension
      migType: regExGroupResult[2], // Mig type
      extension: regExGroupResult[4] // file extension
    }
    return resultObj
  }

  /**
   *
   * @param {{filename: String, xml: String, docType: String, reprint: boolean, docStatus:int, extramemo:string, uploadDocument: boolean }} xmlFileObj
   */
  function downloadEGuiPdf(xmlFileObj) {
    log.debug({ title: 'getEGuiPdf', details: xmlFileObj.filename })
    log.debug({ title: 'getEGuiPdf', details: xmlFileObj.docType })
    var responseObj = {
      success: true,
      code: 0,
      body: '',
      error: ''
    }
    var requestUrl = getDownloadUrl(xmlFileObj.docType)
    log.debug({ title: 'getEGuiPdf requestUrl', details: requestUrl })
    var header = getHeaders(xmlFileObj.docType)
    header['Content-Type'] = 'application/json'
    var postBody = getPostBody(xmlFileObj, null)
    log.debug({ title: 'onPost postBody', details: postBody })
    try {
      let response = https.post({
        url: requestUrl,
        body: JSON.stringify(postBody),
        headers: header
      })
      responseObj.code = response.code
      responseObj.body = response.body
      if (response.code !== 200) {
        responseObj.success = false
        responseObj.body = 'Error Occurs: ' + response.body
      }
    } catch (e) {
      responseObj.success = false
      responseObj.error = e
    }

    log.debug({ title: 'uploadGuiXml responseCode', details: responseObj })
    return responseObj
  }

  function printEGui(xmlFileObj, printerSetting) {
    // log.debug({ title: 'printEGui', details: xmlFileObj.filename })
    // log.debug({ title: 'printEGui', details: xmlFileObj.docType })
    // log.debug({ title: 'printEGui printerSetting', details: printerSetting })
    var responseObj = {
      success: true,
      code: 0,
      body: '',
      error: ''
    }
    var requestUrl = getPrintUrl(xmlFileObj.docType)
    log.debug({ title: 'printEGui requestUrl', details: requestUrl })
    var header = getHeaders(xmlFileObj.docType)
    header['Content-Type'] = 'application/json'
    var postBody = getPostBody(xmlFileObj, printerSetting)
    log.debug({ title: 'printEGui postBody', details: postBody })
    try {
      let response = https.post({
        url: requestUrl,
        body: JSON.stringify(postBody),
        headers: header
      })
      responseObj.code = response.code
      responseObj.body = response.body
      if (response.code !== 200) {
        responseObj.success = false
        responseObj.body = 'Error Occurs: ' + response.body
      }
    } catch (e) {
      responseObj.success = false
      responseObj.error = e
    }

    log.debug({ title: 'printEGui responseCode', details: responseObj })
    return responseObj
  }

  /**
   *
   * @param {{filename: string, xml: string, docType: string, reprint: boolean, docStatus: int, extramemo: string, uploadDocument: boolean, linePrintSpace: string}} xmlFileObject
   * @param {{id: int, name: string, printerKey: string, printerType: {id:int, text: string}, department:{id:int, text:string}, printDetail: boolean, printContact: boolean, lineSpacing: int}} printerSetting
   */
  function getPostBody(xmlFileObject, printerSetting) {
    log.debug({ title: 'getPostBody printerSetting', details: printerSetting })
    var xmlStringBase64 = encode.convert({
      string: xmlFileObject.xml,
      inputEncoding: encode.Encoding.UTF_8,
      outputEncoding: encode.Encoding.BASE_64
    })
    var lineSpace = xmlFileObject.linePrintSpace
      ? parseInt(xmlFileObject.linePrintSpace)
      : 3
    var body = {
      url: '',
      payload: {
        xml: xmlStringBase64,
        filename: xmlFileObject.filename,
        checksum: '',
        documentStatus: xmlFileObject.docStatus || 2, //2: Issue, 3: cancel, 4: void, 5:reject
        extramemo: xmlFileObject.extramemo || ''
      },
      attribute: {
        // FOR PRINT
        printerName: 'Sharp',
        printerType: 'GENERAL',
        printerKey: 'uuid',
        //printerType: '', // GENERAL  ACLAS WINPOS POSIFLEX
        //// FOR LAYOUT
        // GENERAL
        lineSpacing: lineSpace, // 1,2,3,6
        // ACLAS WINPOS POSIFLEX
        printDetail: false,
        // ACLAS WINPOS POSIFLEX
        printContact: false,
        // GENERAL ACLAS WINPOS POSIFLEX
        reprint: xmlFileObject.reprint,
        // is upload document upload
        uploadDocument: xmlFileObject.uploadDocument
      }
    }
    if (printerSetting) {
      body.attribute.printerName = printerSetting.name
      body.attribute.printerType = printerSetting.printerType.text
      body.attribute.printerKey = printerSetting.printerKey
      body.attribute.lineSpacing = printerSetting.lineSpacing
      body.attribute.printDetail = printerSetting.printDetail
      body.attribute.printContact = printerSetting.printContact
    }
    return body
  }

  exports.getGuiStatus = getGuiStatus
  exports.uploadGuiXml = uploadGuiXml
  exports.downloadEGuiPdf = downloadEGuiPdf
  exports.printEGui = printEGui
  exports.DOCTYPE = documentType
  return exports
})
