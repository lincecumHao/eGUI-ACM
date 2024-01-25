/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */

define([
  'N/runtime',
  'N/config',
  'N/ui/serverWidget',
  'N/record',
  'N/search',
  'N/format',
  '../gw_common_utility/gw_common_date_utility',
  '../gw_common_utility/gw_common_string_utility',
  '../gw_common_utility/gw_common_configure',
], function (
  runtime,
  config,
  serverWidget,
  record,
  search,
  format,
  dateutility,
  stringutility,
  gwconfigure
) {
  var _numericToFixed = gwconfigure.getGwNumericToFixed() //小數點位數
  var _invoiceActionScriptId = gwconfigure.getGwInvoiceActionScriptId()
  var _invoiceActionDeploymentId = gwconfigure.getGwInvoiceActionDeploymentId()
  var _salesAccountValue = gwconfigure.getGwSalesAccountValue() //4000 Sales (銷貨收入的accountnumber)

  var _gw_invoice_detail_search_id = gwconfigure.getGwInvoiceDetailSearchId() //Invoice Detail Search

  var _voucher_main_record = gwconfigure.getGwVoucherMainRecord()

  //取得客戶資料
  function getCustomerInformation(customer_id) {
    var _customerRecord = record.load({
      type: record.Type.CUSTOMER,
      id: customer_id,
      isDynamic: true,
    })

    var entityid = _customerRecord.getValue({
      fieldId: 'entityid',
    })
    var _customer_buyer_name = _customerRecord.getValue({
      fieldId: 'companyname',
    })
    var _customer_buyer_email = _customerRecord.getValue({
      fieldId: 'email',
    })
    var _customer_buyer_identifier = _customerRecord.getValue({
      fieldId: 'vatregnumber',
    })
    //統一編號
    var _gw_ban_number = _customerRecord.getValue({
      fieldId: 'custentity_gw_tax_id_number',
    })
    var _customer_address = _customerRecord.getValue({
      fieldId: 'defaultaddress',
    })

    var _jsonObj = {
      entityid: entityid,
      companyname: _customer_buyer_name,
      email: _customer_buyer_email,
      vatregnumber: _gw_ban_number,
      defaultaddress: _customer_address,
    }

    return _jsonObj
  }
  

  //取得賣方公司資料
  function getSellerInfo(businessNo) {
    var _companyObj
    try {
		 var _businessSearch = search
				  .create({
					type: 'customrecord_gw_business_entity',
					columns: ['custrecord_gw_be_tax_id_number', 'custrecord_gw_be_gui_title', 'custrecord_gw_be_business_address', 'custrecord_gw_be_contact_email'],
					filters: ['custrecord_gw_be_tax_id_number', 'is', businessNo]
				  })
				  .run()
				  .each(function (result) {
					var _internalid = result.id

					var _tax_id_number = result.getValue({
					  name: 'custrecord_gw_be_tax_id_number',
					})
					var _be_gui_title = result.getValue({
					  name: 'custrecord_gw_be_gui_title',
					})
					var _business_address = result.getValue({
					  name: 'custrecord_gw_be_business_address',
					})
					var _contact_email = result.getValue({
					  name: 'custrecord_gw_be_contact_email',
					})
					
					_companyObj = {
						'tax_id_number':_tax_id_number,
						'be_gui_title':_be_gui_title,
						'business_address':_business_address,
						'contact_email':_contact_email
					}
 
					return true
				  }) 
	  
       
    } catch (e) {
      log.error(e.name, e.message)
    }

    return _companyObj
  }

  //顯示畫面
  function createFormHeader(form, apply_business_no, _selected_invoice_Id) {
    /////////////////////////////////////////////////////////////
    //load company information
	var _seller_obj = getSellerInfo(apply_business_no) 
	log.debug('get seller_obj', JSON.stringify(_seller_obj))
	var _taxid = _seller_obj.tax_id_number
	var _companyname = _seller_obj.be_gui_title
	var _mainaddress_text = _seller_obj.business_address
	//暫借欄位做統編
	var _ban = _taxid
	var _legalname = _seller_obj.be_gui_title	  
    /////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////
    var _row01_fieldgroupid = form.addFieldGroup({
      id: 'row01_fieldgroupid',
      label: '憑證資訊',
    })
    ////////////////////////////////////////////////////////////////////////////////////////////
    //公司統編
    var _company_ban = form.addField({
      id: 'custpage_company_ban',
      type: serverWidget.FieldType.TEXT,
      label: '公司統編',
      container: 'row01_fieldgroupid',
    })
    _company_ban.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    //公司地址
    var _company_address = form.addField({
      id: 'custpage_company_address',
      type: serverWidget.FieldType.TEXT,
      label: '公司地址',
      container: 'row01_fieldgroupid',
    })
    _company_address.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    //公司名稱
    var _company_name = form.addField({
      id: 'custpage_company_name',
      type: serverWidget.FieldType.TEXT,
      label: '公司名稱',
      container: 'row01_fieldgroupid',
    })

    
    _company_ban.defaultValue = _ban
    _company_address.defaultValue = _mainaddress_text
    _company_name.defaultValue = _legalname
    ////////////////////////////////////////////////////////////////////////////////////////////
    //發票資料格式
    var _mig_type = form.addField({
      id: 'custpage_mig_type',
      type: serverWidget.FieldType.SELECT,
      label: '發票資料格式',
      container: 'row01_fieldgroupid',
    })
    _mig_type.addSelectOption({
      value: 'B2C',
      text: 'B2C-存證',
    })

    //字軌使用方式
    var _selectDeductionPeriod = form.addField({
      id: 'custpage_allowance_log_type',
      type: serverWidget.FieldType.SELECT,
      label: '是否上傳憑證',
      container: 'row01_fieldgroupid',
    })
    _selectDeductionPeriod.addSelectOption({
      value: 'TYPE_2',
      text: '不上傳',
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //客戶名稱
    var _customer_id = form.addField({
      id: 'custpage_customer_id',
      type: serverWidget.FieldType.SELECT,
      label: '客戶代碼',
      source: 'customer',
      container: 'row01_fieldgroupid',
    })

    if (stringutility.trim(_selected_invoice_Id) != '') {
      _customer_id.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.DISABLED,
      })
    }

    //公司統編
    var _buyer_identifier = form.addField({
      id: 'custpage_buyer_identifier',
      type: serverWidget.FieldType.TEXT,
      label: '買方公司統編',
      container: 'row01_fieldgroupid',
    })
    /**
    _buyer_identifier.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
    */
    //公司名稱
    var _buyer_name = form.addField({
      id: 'custpage_buyer_name',
      type: serverWidget.FieldType.TEXT,
      label: '買方公司名稱',
      container: 'row01_fieldgroupid',
    })
    /**
    _buyer_name.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
    */
    //買方E-mail
    var _buyer_email = form.addField({
      id: 'custpage_buyer_email',
      type: serverWidget.FieldType.EMAIL,
      label: '買方E-mail',
      container: 'row01_fieldgroupid',
    })
    _buyer_email.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })

    //買方地址
    var _customs_buyer_address = form.addField({
      id: 'custpage_buyer_address',
      type: serverWidget.FieldType.TEXT,
      label: '買方地址',
      container: 'row01_fieldgroupid',
    })
    _customs_buyer_address.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
  }

  function createInvoiceDetails(form, _selected_invoice_Id) {
    //處理Detail
    var sublist
    if (stringutility.trim(_selected_invoice_Id) == '') {
      sublist = form.addSublist({
        id: 'invoicesublistid',
        type: serverWidget.SublistType.INLINEEDITOR,
        label: '歷史發票號碼-清單',
      })
    } else {
      sublist = form.addSublist({
        id: 'invoicesublistid',
        type: serverWidget.SublistType.LIST,
        label: '歷史發票號碼-清單',
      })
      //_itemNameField.updateDisplayType({displayType: serverWidget.FieldDisplayType.ENTRY});
    }

    ////////////////////////////////////////////////////////////////////////////
    //Hidden Element Start
    var _idField = sublist.addField({
      id: 'customer_search_invoice_id',
      label: 'Internal ID',
      type: serverWidget.FieldType.TEXT,
    })
    _idField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    var _numberField = sublist.addField({
      id: 'customer_search_invoice_number',
      label: 'Invoice Number',
      type: serverWidget.FieldType.TEXT,
    })
    _numberField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    //Hidden Element End
    ////////////////////////////////////////////////////////////////////////////

    var _formatCodeField = sublist.addField({
      id: 'selected_gw_voucher_format_code',
      type: serverWidget.FieldType.SELECT,
      label: '格式代號',
    })
    _formatCodeField.addSelectOption({
      value: '31-01',
      text: '31-銷項三聯式[裝訂數:50張]',
    })
    _formatCodeField.addSelectOption({
      value: '31-05',
      text: '31-銷項電子計算機統一發票[裝訂數:50張]',
    })
    _formatCodeField.addSelectOption({
      value: '32-02',
      text: '32-銷項二聯式[裝訂數:50張]',
    })
    _formatCodeField.addSelectOption({
      value: '32-03',
      text: '32-銷項二聯式收銀機統一發票[裝訂數:250張]',
    })
    _formatCodeField.addSelectOption({
      value: '35-06',
      text: '35-銷項三聯式收銀機統一發票[裝訂數:250張]',
    })
    _formatCodeField.addSelectOption({
      value: '35-07',
      text: '35-一般稅額電子發票[裝訂數:50張]',
    })
    if (stringutility.trim(_selected_invoice_Id).length != 0) {
      _formatCodeField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.ENTRY,
      })
    } 
    var _voucherDateField = sublist.addField({
      id: 'selected_gw_voucher_date',
      label: '開立日期',
      type: serverWidget.FieldType.DATE,
    })

    var _voucherNumberField = sublist.addField({
      id: 'selected_gw_voucher_number',
      type: serverWidget.FieldType.TEXT,
      label: '發票號碼',
    })
    _voucherNumberField.maxLength = 10

    var _taxTypeField = sublist.addField({
      id: 'selected_gw_tax_type',
      type: serverWidget.FieldType.SELECT,
      label: '稅別',
    })
    _taxTypeField.addSelectOption({
      value: '1',
      text: '應稅(一般稅率)',
    })
    _taxTypeField.addSelectOption({
      value: '2',
      text: '零稅率',
    })
    _taxTypeField.addSelectOption({
      value: '3',
      text: '免稅',
    })
    _taxTypeField.addSelectOption({
      value: '9',
      text: '混合稅',
    })
    if (stringutility.trim(_selected_invoice_Id).length != 0) {
      _taxTypeField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.ENTRY,
      })
    }

    var _taxRateField = sublist.addField({
      id: 'selected_gw_tax_rate',
      type: serverWidget.FieldType.SELECT,
      label: '稅率',
    })
    _taxRateField.addSelectOption({
      value: '5',
      text: '5',
    })
    _taxRateField.addSelectOption({
      value: '0',
      text: '0',
    })
    if (stringutility.trim(_selected_invoice_Id).length != 0) {
      _taxRateField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.ENTRY,
      })
    }

    var _salesAmountField = sublist.addField({
      id: 'selected_gw_sales_amount',
      type: serverWidget.FieldType.FLOAT,
      label: '銷售金額(未稅)',
    })
    if (stringutility.trim(_selected_invoice_Id).length != 0) {
      _salesAmountField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.ENTRY,
      })
    }

    var _freeAmountField = sublist.addField({
      id: 'selected_gw_free_sales_amount',
      type: serverWidget.FieldType.FLOAT,
      label: '免稅銷售金額',
    })
    if (stringutility.trim(_selected_invoice_Id).length != 0) {
      _freeAmountField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.ENTRY,
      })
    }

    var _zeroAmountField = sublist.addField({
      id: 'selected_gw_zero_sales_amount',
      type: serverWidget.FieldType.FLOAT,
      label: '零稅銷售金額',
    })
    if (stringutility.trim(_selected_invoice_Id).length != 0) {
      _zeroAmountField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.ENTRY,
      })
    }

    var _discountSalesAmountField = sublist.addField({
      id: 'selected_gw_discount_sales_amount',
      type: serverWidget.FieldType.FLOAT,
      label: '已折金額(應稅)',
    })
    if (stringutility.trim(_selected_invoice_Id).length != 0) {
      _discountSalesAmountField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.ENTRY,
      })
    }
    var _discountZeroAmountField = sublist.addField({
      id: 'selected_gw_discount_zero_amount',
      type: serverWidget.FieldType.FLOAT,
      label: '已折金額(零稅)',
    })
    if (stringutility.trim(_selected_invoice_Id).length != 0) {
      _discountZeroAmountField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.ENTRY,
      })
    }
    var _discountFreeAmountField = sublist.addField({
      id: 'selected_gw_discount_free_amount',
      type: serverWidget.FieldType.FLOAT,
      label: '已折金額(免稅)',
    })
    if (stringutility.trim(_selected_invoice_Id).length != 0) {
      _discountFreeAmountField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.ENTRY,
      })
    }

    if (stringutility.trim(_selected_invoice_Id) == '') return
    /////////////////////////////////////////////////////////////////////////////////////////
    //1.處理 Invoice Detail Items
    var _mySearch = search.create({
      type: _voucher_main_record,
      columns: [
        search.createColumn({
          name: 'custrecord_gw_voucher_number',
          sort: search.Sort.ASC,
        }),
        search.createColumn({ name: 'custrecord_gw_voucher_date' }),
        search.createColumn({ name: 'custrecord_gw_invoice_type' }),
        search.createColumn({ name: 'custrecord_gw_mig_type' }),
        search.createColumn({ name: 'custrecord_gw_voucher_format_code' }),
        search.createColumn({ name: 'custrecord_gw_sales_amount' }),
        search.createColumn({ name: 'custrecord_gw_free_sales_amount' }),
        search.createColumn({ name: 'custrecord_gw_zero_sales_amount' }),
        search.createColumn({ name: 'custrecord_gw_tax_amount' }),
        search.createColumn({ name: 'custrecord_gw_tax_type' }),
        search.createColumn({ name: 'custrecord_gw_tax_rate' }),
        search.createColumn({ name: 'custrecord_gw_total_amount' }),
        search.createColumn({ name: 'custrecord_gw_discount_sales_amount' }), //
        search.createColumn({ name: 'custrecord_gw_discount_free_amount' }), //
        search.createColumn({ name: 'custrecord_gw_discount_zero_amount' }), //
        search.createColumn({ name: 'custrecord_gw_discount_amount' }), //
        search.createColumn({ name: 'custrecord_gw_buyer' }), //統編
        search.createColumn({ name: 'custrecord_gw_buyer_name' }),
        search.createColumn({ name: 'custrecord_gw_original_buyer_id' }),
      ],
    })
    var _filterArray = []
    _filterArray.push(['custrecord_gw_is_manual_voucher', 'is', true])
    if (_selected_invoice_Id != null) {
      var _internalIdAry = _selected_invoice_Id.split(',')
      _filterArray.push('and')
      _filterArray.push(['internalid', 'anyof', _internalIdAry])
    }
    _mySearch.filterExpression = _filterArray

    ////////////////////////////////////////////////////////////////////////////////////////
    var row = 0
    _mySearch.run().each(function (result) {
      var _internalid = result.id
      sublist.setSublistValue({
        id: 'customer_search_invoice_id',
        line: row,
        value: _internalid,
      })

      var _voucher_number = result.getValue({
        name: 'custrecord_gw_voucher_number',
      })
      sublist.setSublistValue({
        id: 'selected_gw_voucher_number',
        line: row,
        value: stringutility.trimOrAppendBlank(_voucher_number),
      })

      ////////////////////////////////////////////////////////////////////////////////////////////////
      //note : the _voucher_date field Type is Decimal Number
      var _voucher_date_str = result.getValue({
        name: 'custrecord_gw_voucher_date',
      })

      var _pattern = /(\d{4})(\d{2})(\d{2})/
      var _voucher_date = new Date(
        _voucher_date_str.replace(_pattern, '$2/$3/$1')
      ) //MM/DD/YYYY
      var _myDate = format.format({
        value: _voucher_date,
        type: format.Type.DATE,
      })

      sublist.setSublistValue({
        id: 'selected_gw_voucher_date',
        line: row,
        value: _myDate,
      })
      ////////////////////////////////////////////////////////////////////////////////////////////////
      var _gw_mig_type = result.getValue({
        name: 'custrecord_gw_mig_type',
      })

      var _invoice_type = result.getValue({
        name: 'custrecord_gw_invoice_type',
      })

      var _voucher_format_code = result.getValue({
        name: 'custrecord_gw_voucher_format_code',
      })
      _voucher_format_code = _voucher_format_code + '-' + _invoice_type
      sublist.setSublistValue({
        id: 'selected_gw_voucher_format_code',
        line: row,
        value: stringutility.trimOrAppendBlank(_voucher_format_code),
      })
      var _tax_type = result.getValue({
        name: 'custrecord_gw_tax_type',
      })
      sublist.setSublistValue({
        id: 'selected_gw_tax_type',
        line: row,
        value: stringutility.trimOrAppendBlank(_tax_type),
      })
      var _tax_rate = result.getValue({
        name: 'custrecord_gw_tax_rate',
      })
      sublist.setSublistValue({
        id: 'selected_gw_tax_rate',
        line: row,
        value: stringutility.convertToInt(_tax_rate),
      })
      var _sales_amount = result.getValue({
        name: 'custrecord_gw_sales_amount',
      })
      sublist.setSublistValue({
        id: 'selected_gw_sales_amount',
        line: row,
        value: stringutility.convertToInt(_sales_amount),
      })
      var _free_sales_amount = result.getValue({
        name: 'custrecord_gw_free_sales_amount',
      })
      sublist.setSublistValue({
        id: 'selected_gw_free_sales_amount',
        line: row,
        value: stringutility.convertToInt(_free_sales_amount),
      })
      var _zero_sales_amount = result.getValue({
        name: 'custrecord_gw_zero_sales_amount',
      })
      sublist.setSublistValue({
        id: 'selected_gw_zero_sales_amount',
        line: row,
        value: stringutility.convertToInt(_zero_sales_amount),
      })

      var _discount_sales_amount = result.getValue({
        name: 'custrecord_gw_discount_sales_amount',
      })
      sublist.setSublistValue({
        id: 'selected_gw_discount_sales_amount',
        line: row,
        value: stringutility.convertToInt(_discount_sales_amount),
      })

      var _discount_zero_amount = result.getValue({
        name: 'custrecord_gw_discount_zero_amount',
      })
      sublist.setSublistValue({
        id: 'selected_gw_discount_zero_amount',
        line: row,
        value: stringutility.convertToInt(_discount_zero_amount),
      })

      var _discount_free_amount = result.getValue({
        name: 'custrecord_gw_discount_free_amount',
      })
      sublist.setSublistValue({
        id: 'selected_gw_discount_free_amount',
        line: row,
        value: stringutility.convertToInt(_discount_free_amount),
      })

      var _buyer = result.getValue({
        name: 'custrecord_gw_buyer',
      })
      var _buyer_name = result.getValue({
        name: 'custrecord_gw_buyer_name',
      })

      var _original_buyer_id = result.getValue({
        name: 'custrecord_gw_original_buyer_id',
      })

      if (row == 0) {
        log.debug('passed _original_buyer_id', _original_buyer_id)
        var _mig_type_field = form.getField({
          id: 'custpage_mig_type',
        })
        _mig_type_field.defaultValue = _gw_mig_type
        
        //var _customerObj = getCustomerRecord(_buyer);
        var _customerObj = getCustomerInformation(_original_buyer_id)
        var _customerField = form.getField({
          id: 'custpage_customer_id',
        })
        //_customerField.defaultValue = _customerObj.entityid;
        _customerField.defaultValue = _original_buyer_id

        var _buyerIdentifierldField = form.getField({
          id: 'custpage_buyer_identifier',
        })
        /**
        if (_customerObj.vatregnumber=='') {
        	_buyerIdentifierldField.defaultValue = _buyer
        } else {
           _buyerIdentifierldField.defaultValue = _customerObj.vatregnumber
        }
        */
        if (_buyer !='') {
        	_buyerIdentifierldField.defaultValue = _buyer
        } else {
           _buyerIdentifierldField.defaultValue = _customerObj.vatregnumber
        }
        
        var _buyerNameField = form.getField({
          id: 'custpage_buyer_name',
        })         
        if (_buyer_name !='') {
        	_buyerNameField.defaultValue = _buyer_name
        } else {
        	_buyerNameField.defaultValue = _customerObj.companyname
        }

        var _buyerEmailField = form.getField({
          id: 'custpage_buyer_email',
        })
        _buyerEmailField.defaultValue = _customerObj.email

        var _buyerAddressField = form.getField({
          id: 'custpage_buyer_address',
        })
        _buyerAddressField.defaultValue = _customerObj.defaultaddress
      }
      row++

      return true
    })

    /////////////////////////////////////////////////////////////////////////////////////////
  }

  function onRequest(context) {
    var _selected_invoice_Id = context.request.parameters.invoice_hiddent_listid
    var _selected_business_no = context.request.parameters.selected_business_no
    log.debug('passed parameters', 'business_no:'+_selected_business_no+ ' ,selected_invoice_Id:'+_selected_invoice_Id)
    //處理資料
    if (context.request.method === 'POST') {
    }
    ///////////////////////////////////////////////////////////////////////////////////////////
    //做畫面-START
    ///////////////////////////////////////////////////////////////////////////////////////////
    var form = serverWidget.createForm({
      title: '歷史發票作業（憑證開立）',
    })
    //Hiddent Element
    var _hiddenfield = form.addField({
      id: 'custpage_invoice_hiddent_buttontype',
      type: serverWidget.FieldType.TEXT,
      label: 'HIDDEN',
    })
    _hiddenfield.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    //////////////////////////////////////////////////////////////////////////////////////////
    //BAN
    var _hidden_business_no = form.addField({
      id: 'selected_business_no',
      type: serverWidget.FieldType.TEXT,
      label: 'HIDDEN',
    })
    _hidden_business_no.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    _hidden_business_no.defaultValue = _selected_business_no
    //發票List
    var _hiddeninvoicelistld = form.addField({
      id: 'invoice_hiddent_listid',
      type: serverWidget.FieldType.TEXT,
      label: 'HIDDEN',
    })
    _hiddeninvoicelistld.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    _hiddeninvoicelistld.defaultValue = _selected_invoice_Id
    //////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////
    createFormHeader(form, _selected_business_no, _selected_invoice_Id)

    createInvoiceDetails(form, _selected_invoice_Id)

    /////////////////////////////////////////////////////////////////////////////////////////
    //status, yearMonth, deptCode
    form.addButton({
      id: 'custpage_create_voucher_button',
      label: '開立憑證',
      functionName:
        'submitManualVoucher("' +
        _invoiceActionScriptId +
        '","' +
        _invoiceActionDeploymentId +
        '")',
    })

    ////////////////////////////////////////////////////////////////////////////////////////////
    //做畫面-END
    ///////////////////////////////////////////////////////////////////////////////////////////

    form.clientScriptModulePath = './gw_invoice_ui_manual_event.js'
    context.response.writePage(form)
  } //End onRequest

  return {
    onRequest: onRequest,
  }
})
