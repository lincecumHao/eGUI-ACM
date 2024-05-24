/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 */
define([
  'N/runtime',
  'N/config',
  'N/search',
  'N/record',
  'N/format',
  '../gw_common_utility/gw_syncegui_to_document_utility',
  '../gw_common_utility/gw_common_date_utility',
  '../gw_common_utility/gw_common_string_utility',
  '../../gw_library/gw_api/gw_api',
  '../gw_common_utility/gw_common_configure',
], function (
  runtime,
  config,
  search,
  record,
  format,
  synceguidocument,
  dateutility,
  stringutility,
  gwapi,
  gwconfigure
) {
  var _voucher_main_record = gwconfigure.getGwVoucherMainRecord()
  var _voucher_apply_list_record = gwconfigure.getGwVoucherApplyListRecord()

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //取得當地時間
  function getLocalDate() {
    var _date = new Date()
    var _dateString = format.format({
      value: _date,
      type: format.Type.DATETIME,
      timezone: format.Timezone.ASIA_TAIPEI,
    })
    //2020-08-18 13:29:44
    return _dateString
  }

  //取得日期=20200709
  function getCompanyLocatDate() {
    var _dateString = getLocalDate()
    var _date = _dateString.slice(0, 10).replace(/\//g, '')

    return _date
  }

  //取得時間=09:10:25
  function getCompanyLocatTime() {
    var _dateString = getLocalDate()
    var _time = _dateString.slice(11, 20).replace('/', '')
    var _ary = _time.split(':')
    if (_ary[0].length == 1) {
      _ary[0] = '0' + _ary[0]
    }

    _time = _ary[0] + ':' + _ary[1] + ':' + _ary[2]

    return _time
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //處理NS Invoice資料-START
  //1.取得Invoice ID Apply List
  function getVoucherSingleScheduleToDoList(voucher_open_type) {
    var _voucherIdjAry = []
    try {
      var _mySearch = search.create({
        type: _voucher_apply_list_record,
        columns: [
          search.createColumn({ name: 'internalid' }),
          search.createColumn({ name: 'custrecord_gw_voucher_open_type' }),
          search.createColumn({
            name: 'custrecord_gw_voucher_apply_invoice_type',
          }), //07, 08
          search.createColumn({ name: 'custrecord_gw_voucher_apply_mig_type' }), //B2BS, B2BE, B2C
          search.createColumn({ name: 'custrecord_gw_voucher_void_comment' }),
          search.createColumn({ name: 'custrecord_gw_invoice_todo_list' }),
          search.createColumn({ name: 'custrecord_gw_invoice_apply_list' }),
          //折讓單
          search.createColumn({ name: 'custrecord_gw_creditmemo_apply_list' }),
          search.createColumn({ name: 'custrecord_gw_creditmemo_todo_list' }),
          
        ],
      })
      var _filterArray = []
      _filterArray.push([
        'custrecord_gw_voucher_apply_type',
        search.Operator.IS,
        'CANCEL',
      ])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_open_type',
        search.Operator.IS,
        voucher_open_type,
      ])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_completed_schedule_task',
        search.Operator.IS,
        'N',
      ])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_flow_status',
        search.Operator.IS,
        'CANCEL_APPROVE',
      ])

      _mySearch.filterExpression = _filterArray
      log.debug('_filterArray', JSON.stringify(_filterArray))
      _mySearch.run().each(function (result) {
        var _internalid = result.getValue({
          name: 'internalid',
        })
        var _invoice_type = result.getValue({
          name: 'custrecord_gw_voucher_apply_invoice_type',
        })

        var _mig_type = result.getValue({
          name: 'custrecord_gw_voucher_apply_mig_type',
        })
        var _invoice_apply_list = result.getValue({
          name: 'custrecord_gw_invoice_apply_list',
        })
        var _invoice_todo_list = result.getValue({
          name: 'custrecord_gw_invoice_todo_list',
        })
        //Credit Memo
        var _creditmemo_apply_list = result.getValue({
          name: 'custrecord_gw_creditmemo_apply_list',
        })
        var _creditmemo_todo_list = result.getValue({
          name: 'custrecord_gw_creditmemo_todo_list',
        })
        
        var _voucher_open_type = result.getValue({
          name: 'custrecord_gw_voucher_open_type',
        })

        var _void_comment = result.getValue({
          name: 'custrecord_gw_voucher_void_comment',
        })

        //抓ToDO ID List
        //Invoice ToDo List
        if (stringutility.trim(_invoice_todo_list) !== '') {
          var _obj = {
            internalid: _internalid,
            // openType: _voucher_open_type, //SINGLE-INVOICE-SCHEDULE
            // invoiceType: _invoice_type,   //CANCEL
            reason: _void_comment,
            applyId: _invoice_todo_list,
          }

          _voucherIdjAry.push(_obj)
        }
        //Credit Memo ToDo List
        if (stringutility.trim(_creditmemo_todo_list) !== '') {
            var _obj = {
              internalid: _internalid,
              openType: _voucher_open_type, //SINGLE-ALLOWANCE-SCHEDULE
              invoiceType: _invoice_type,   //CANCEL
              reason: _void_comment,
              applyId: _creditmemo_todo_list,
            }

            _voucherIdjAry.push(_obj)
        }
        
        return true
      })
    } catch (e) {
      log.error(e.name, e.message)
    }
    log.debug('_voucherIdjAry', JSON.stringify(_voucherIdjAry))
    return _voucherIdjAry
  }

  function wrapCancelVoucherXml(
    mig_type,
    voucher_type,
    voucher_number,
    voucher_date,
    seller,
    buyer,
    reason,
    remark
  ) {
    var _xml = ''
    try {
      _xml += '<?xml version="1.0" encoding="utf-8"?>'
      if (voucher_type == 'EGUI') {
        if (mig_type == 'B2BS' || mig_type == 'B2C') {
          //C0501
          _xml += '<CancelInvoice xmlns="urn:GEINV:eInvoiceMessage:C0501:3.1">'
        } else if (mig_type == 'B2BE') {
          //A0201
          _xml += '<CancelInvoice xmlns="urn:GEINV:eInvoiceMessage:A0201:3.1">'
        }
        _xml +=
          '<CancelInvoiceNumber>' + voucher_number + '</CancelInvoiceNumber>'
        _xml += '<InvoiceDate>' + voucher_date + '</InvoiceDate>'
        _xml += '<BuyerId>' + buyer + '</BuyerId>'
        _xml += '<SellerId>' + seller + '</SellerId>'
        _xml += '<CancelDate>' + dateutility.getCompanyLocatDate() + '</CancelDate>'
        _xml += '<CancelTime>' + dateutility.getCompanyLocatTime() + '</CancelTime>'
        _xml += '<CancelReason>' + reason + '</CancelReason>'
        if (mig_type == 'B2BE') {
          _xml += '<Remark>' + remark + '</Remark>'
        }
        _xml += '</CancelInvoice>'
      } else if (voucher_type == 'ALLOWANCE') {
        if (mig_type == 'B2BS' || mig_type == 'B2C') {
          //D0501
          _xml +=
            '<CancelAllowance xmlns="urn:GEINV:eInvoiceMessage:D0501:3.1">'
        } else if (mig_type == 'B2B') { //要由買方作廢
        	_xml +=
                '<CancelAllowance xmlns="urn:GEINV:eInvoiceMessage:B0501:3.1">'
        } else if (mig_type == 'B2BE') {
          //B0201
          _xml +=
            '<CancelAllowance xmlns="urn:GEINV:eInvoiceMessage:B0201:3.1">'
        }
        _xml +=
          '<CancelAllowanceNumber>' +
          voucher_number +
          '</CancelAllowanceNumber>'
        _xml += '<AllowanceDate>' + voucher_date + '</AllowanceDate>'
        _xml += '<BuyerId>' + buyer + '</BuyerId>'
        _xml += '<SellerId>' + seller + '</SellerId>'
        _xml += '<CancelDate>' + dateutility.getCompanyLocatDate() + '</CancelDate>'
        _xml += '<CancelTime>' + dateutility.getCompanyLocatTime() + '</CancelTime>'
        _xml += '<CancelReason>' + reason + '</CancelReason>'
        _xml += '</CancelAllowance>'
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
    return _xml
  }

  function uploadToGWAndUpdateResult(voucher_type, internalIdAry, reason) {
    var _completedIDsAry = []

    try {
      //this search is ordered by id, taxrate
      var _mySearch = search.create({
        type: _voucher_main_record,
        columns: [
          search.createColumn({ name: 'custrecord_gw_voucher_number' }),
          search.createColumn({
            name: 'custrecord_gw_voucher_date',
            sort: search.Sort.ASC,
          }),
          search.createColumn({ name: 'custrecord_gw_voucher_time' }),
          search.createColumn({ name: 'custrecord_gw_voucher_yearmonth' }),
          search.createColumn({ name: 'custrecord_gw_seller' }),
          search.createColumn({ name: 'custrecord_gw_buyer' }),
          search.createColumn({ name: 'custrecord_gw_mig_type' }),
        ],
      })

      var _filterArray = []
      _filterArray.push(['internalid', search.Operator.ANYOF, internalIdAry])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_status',
        search.Operator.IS,
        'CANCEL_APPROVE',
      ])

      _mySearch.filterExpression = _filterArray
      _mySearch.run().each(function (result) {
        var _internalid = result.id
        var _voucher_number = result.getValue({
          name: 'custrecord_gw_voucher_number',
        })
        var _voucher_date = result.getValue({
          name: 'custrecord_gw_voucher_date',
        })
        var _seller = result.getValue({
          name: 'custrecord_gw_seller',
        })
        var _buyer = result.getValue({
          name: 'custrecord_gw_buyer',
        })
        var _mig_type = result.getValue({
          name: 'custrecord_gw_mig_type',
        })

        var _remark = '' //暫不放值
        var _xml = wrapCancelVoucherXml(
          _mig_type,
          voucher_type,
          _voucher_number,
          _voucher_date,
          _seller,
          _buyer,
          reason,
          _remark
        )

        log.debug('cancel xml', _xml)

        var _file_name = ''
        var _upload_mig_type = ''
        if (voucher_type == 'EGUI') {
          if (_mig_type == 'B2BS' || _mig_type == 'B2C') {
            //C0501
            _upload_mig_type = 'C0501'
          } else if (_mig_type == 'B2BE') {
            //A0201
            _upload_mig_type = 'A0201'
          }
        } else if (voucher_type == 'ALLOWANCE') {
          if (_mig_type == 'B2BS' || _mig_type == 'B2C') {
            //D0501
            _upload_mig_type = 'D0501'
          } else if (_mig_type == 'B2B') {
        	_upload_mig_type = 'B0501'
          } else if (_mig_type == 'B2BE') {
            //B0201
            _upload_mig_type = 'B0201'
          }
        }
        //_file_name = _upload_mig_type + '-' + _voucher_number + '-' + _internalid + '.xml'
        _file_name = _upload_mig_type + '-' + _voucher_number + '-' + new Date().getTime()      
        log.debug('cancel file_name', _file_name)

        var _response = gwapi.uploadGuiXml(_xml, _file_name+'.xml')
        var _code = _response.code // see https.ClientResponse.code
        var _message = _response.body // see https.ClientResponse.body
        log.debug('cancel _code', _code + ' : ' + _message)

        //Update To Main
        updateVoucherStatus(
          voucher_type,
          _internalid,
          _code,
          _message,
          _completedIDsAry,
          _upload_mig_type,
          _file_name,
          _xml
        )

        return true
      })
    } catch (e) {
      log.error(e.name, e.message)
    }

    return _completedIDsAry
  }

  //處理NS Invoice資料-END
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //寫入日誌檔-20201124
  function updateXmlUploadLog(recordObj, mig_type, mig_xml, statusId, message) {
    try {
      log.debug('recordObj', JSON.stringify(recordObj))

      var _record = record.create({
        type: 'customrecord_gw_xml_upload_log',
        isDynamic: true,
      })

      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_apply_id',
        value: stringutility.convertToInt(recordObj.id),
      })

      _record.setValue({
        fieldId: 'custrecord_gw_upload_seller_ban',
        value: recordObj.fields.custrecord_gw_seller,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_buyer_id',
        value: recordObj.fields.custrecord_gw_original_buyer_id,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_buyer_ban',
        value: recordObj.fields.custrecord_gw_buyer,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_number',
        value: recordObj.fields.custrecord_gw_voucher_number,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_yearmonth',
        value: recordObj.fields.custrecord_gw_voucher_yearmonth,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_migtype',
        value: mig_type,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_xml',
        value: mig_xml,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_response_status',
        value: statusId,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_response_message',
        value: message,
      })

      var _upload_voucher_date = dateutility.getCompanyLocatDate()
      var _upload_voucher_time = dateutility.getCompanyLocatTime()
      log.debug(
        'Upload Xml Date',
        '_upload_voucher_date=' +
          _upload_voucher_date +
          ' ,_upload_voucher_time=' +
          _upload_voucher_time
      )

      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_date',
        value: _upload_voucher_date,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_time',
        value: _upload_voucher_time,
      })
      if (
        stringutility.convertToFloat(statusId) < 200 ||
        stringutility.convertToFloat(statusId) > 299
      ) {
        _record.setValue({
          fieldId: 'custrecord_gw_download_voucher_status',
          value: 'E',
        })
      }
      //Hide below fields
      //_record.setValue({fieldId:'custrecord_gw_download_voucher_date',value:message});
      //_record.setValue({fieldId:'custrecord_gw_download_voucher_time',value:message});
      //_record.setValue({fieldId:'custrecord_gw_download_voucher_status',value:message});
      //_record.setValue({fieldId:'custrecord_gw_download_voucher_message',value:message});

      var _applyId = _record.save()
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //處理發票資料-START
  //共用功能
  function updateVoucherStatus(
    voucher_type,
    internalId,
    code,
    message,
    completedIDsAry,
    upload_mig_type,
    file_name,
    xml
  ) {
    try {
      var _record = record.load({
        type: _voucher_main_record,
        id: parseInt(internalId),
        isDynamic: true,
      })
      
      var _upload_status = 'P'
      if (
        stringutility.convertToFloat(code) < 200 ||
        stringutility.convertToFloat(code) > 299
      ) {
        //有錯誤時
    	_upload_status = 'E'
        _record.setValue({
          fieldId: 'custrecord_gw_voucher_status',
          value: 'CANCEL_ERROR',
        })
        _record.setValue({
          fieldId: 'custrecord_gw_voucher_upload_status',
          value: _upload_status,
        })
        _record.setValue({
          fieldId: 'custrecord_gw_uploadstatus_messag',
          value: message,
        })
      } else {
        _record.setValue({
          fieldId: 'custrecord_gw_voucher_status',
          value: 'CANCEL_UPLOAD',
        })
        _record.setValue({
          fieldId: 'custrecord_gw_voucher_upload_status',
          value: _upload_status,
        })
      }      
      _record.setValue({
          fieldId: 'custrecord_upload_xml_file_name',
          value: file_name,
      })

      try {
        _record.save()
        completedIDsAry.push(internalId)

        //寫入日誌檔
        var _recordObj = JSON.parse(JSON.stringify(_record))
        updateXmlUploadLog(_recordObj, upload_mig_type, xml, code, message)
        
        
        //回寫狀態到NS Document    
        if (_upload_status != 'E'){ 
  	        var _voucher_status = _record.getValue({fieldId: 'custrecord_gw_voucher_status'})
  	        var _need_upload_egui_mig = _record.getValue({fieldId: 'custrecord_gw_need_upload_egui_mig'})
  	       
  	        var _voucher_main_internalid_ary = [internalId]
  	        synceguidocument.syncEguiUploadStatusToNSEvidenceStatus(_voucher_status, _upload_status, _need_upload_egui_mig, _voucher_main_internalid_ary)
  	    }
      } catch (e) {
        log.debug(e.name, e.message)
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  function closeNSScheduleTask(voucher_type, internalId, _completedIDsAry) {
    try {
      var _record = record.load({
        type: _voucher_apply_list_record,
        id: parseInt(internalId),
        isDynamic: true,
      })

      var _record_todo_fieldId = 'custrecord_gw_invoice_todo_list'
      var _todo_ids_list = []
      if (_completedIDsAry != null) {
    	if (voucher_type=='ALLOWANCE') _record_todo_fieldId ='custrecord_gw_creditmemo_todo_list'
    	else _record_todo_fieldId ='custrecord_gw_invoice_todo_list'
    		
        var _invoice_todo_list = _record.getValue({
          fieldId: _record_todo_fieldId,
        })
        var _invoice_todo_ary = _invoice_todo_list.split(',')

        for (var i = 0; i < _invoice_todo_ary.length; i++) {
          var _id = _invoice_todo_ary[i]

          var _isExist = false
          for (var j = 0; j < _completedIDsAry.length; j++) {
            var _completed_id = _completedIDsAry[j]
            if (_id == _completed_id) {
              _isExist = true
              break
            }
          }
          //沒做完留下來
          if (_id != '-1' && _isExist == false) {
            _todo_ids_list.push(_id)
          }
        }
        _record.setValue({
          fieldId: _record_todo_fieldId,
          value: stringutility.trim(_todo_ids_list.toString()),
        })
      }

      if (stringutility.trim(_todo_ids_list.toString()).length == 0) {
        _record.setValue({
          fieldId: 'custrecord_gw_completed_schedule_task',
          value: 'Y',
        })
      }
      try {
        _record.save()
      } catch (e) {
        log.error(e.name, e.message)
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  function processBatchVoucher(voucher_open_type, voucher_type) {
    try {
      var _voucherObjAry = getVoucherSingleScheduleToDoList(voucher_open_type)

      if (_voucherObjAry.length != 0) {
        //2. 逐筆進行
        var _invoice_completed_ids_ary = []
        for (var i = 0; i < _voucherObjAry.length; i++) {
          var _obj = _voucherObjAry[i]

          var _internalid = _obj.internalid
          var _invoice_type = _obj.invoiceType
          var _open_type = _obj.openType
          var _reason = _obj.reason
          var _invoice_apply_ids = _obj.applyId //放ToDo IDs List
          var _invoice_apply_ary = _invoice_apply_ids.split(',')

          //2.1. 處理發票或折讓單
          //2.1.1. 整理發票或折讓單
          var _completedIDsAry = uploadToGWAndUpdateResult(
            voucher_type,
            _invoice_apply_ary,
            _reason
          )
          log.debug('completedIDsAry', JSON.stringify(_completedIDsAry))
          //4. close task
          closeNSScheduleTask(voucher_type, _internalid, _completedIDsAry)
        }
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //處理發票資料-END
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function executeScript(context) {
    //1. 處理-作廢折讓單
    var _voucher_open_type = 'SINGLE-ALLOWANCE-SCHEDULE'
    var _voucher_type = 'ALLOWANCE'
    processBatchVoucher(_voucher_open_type, _voucher_type)
    log.debug('處理-折讓單', '處理-作廢折讓單-結束')

    //2. 處理-作廢發票
    var _voucher_open_type = 'SINGLE-EGUI-SCHEDULE'
    var _voucher_type = 'EGUI'
    processBatchVoucher(_voucher_open_type, _voucher_type)
    log.debug('處理-發票', '處理-作廢發票-結束')
  }

  return {
    execute: executeScript,
  }
})
