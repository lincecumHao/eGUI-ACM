/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */

define([
  'N/config',
  'N/ui/serverWidget',
  'N/record',
  'N/search',
  '../gw_common_utility/gw_common_date_utility',
  '../gw_common_utility/gw_common_string_utility',
  '../gw_common_utility/gw_common_search_utility',
  '../../gw_dao/taxType/gw_dao_tax_type_21',
  '../gw_common_utility/gw_common_configure',
  '../../gw_dao/carrierType/gw_dao_carrier_type_21',
  '../../gw_dao/busEnt/gw_dao_business_entity_21'
], function (
  config,
  serverWidget,
  record,
  search,
  dateutility,
  stringutility,
  searchutility,
  taxyype21,
  gwconfigure,
  carriertypedao,
  businessEntityDao
) {
  var _numericToFixed = gwconfigure.getGwNumericToFixed() //小數點位數
  var _invoiceActionScriptId = gwconfigure.getGwInvoiceActionScriptId()
  var _invoiceActionDeploymentId = gwconfigure.getGwInvoiceActionDeploymentId()

  var _gw_voucher_properties = gwconfigure.getGwVoucherProperties() //設定檔

  //放公司基本資料
  var _companyObjAry = []

  //取得公司資料
  function getCustomerRecord(businessNo) {
    var _companyObj
    try {
      if (_companyObjAry != null) {
        for (var i = 0; i < _companyObjAry.length; i++) {
          var _obj = JSON.parse(JSON.stringify(_companyObjAry[i]))

          if (_obj.ban == businessNo) {
            _companyObj = _obj
            break
          }
        }
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }

    return _companyObj
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
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

  //處理稅別資料
  var _taxObjAry = []

  function loadAllTaxInformation() {
    try {
        var _all_tax_types = taxyype21.getAll().map(function (_tax_json_obj) {
       	var _ns_tax_json_obj = _tax_json_obj.taxCodes
        return {
       	  voucher_property_id: _tax_json_obj.name.toString(), //TAX_WITH_TAX
          voucher_property_value: _tax_json_obj.value.toString(), //1
          voucher_property_note: _tax_json_obj.text, //應稅
          netsuite_id_value: _ns_tax_json_obj.value || '', //8(NS internalID)
          netsuite_id_text: _ns_tax_json_obj.text || '' //VAT_TW TAX 5%-TW(NS Text)
        }
      })
      
      log.debug('get all_tax_types', JSON.stringify(_all_tax_types))
      return _all_tax_types  
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //取得稅別資料
  function getTaxInformation(eguiTaxId) {
    return _taxObjAry.filter(function (_obj) {
      return _obj.voucher_property_value.toString() === eguiTaxId.toString()
    })[0] 
  }
  

  //取得賣方公司資料
  function getSellerInfo(businessNo) {
    var _companyObj
    try {
      var businessEntity = businessEntityDao.getByTaxId(businessNo)
      _companyObj = {
        tax_id_number: businessEntity.taxId, //_tax_id_number,
        be_gui_title: businessEntity.title, // _be_gui_title,
        business_address: businessEntity.address, //_business_address,
        contact_email: businessEntity.repEmail // _contact_email
      }
    } catch (e) {
      log.error(e.name, e.message)
    }

    return _companyObj
  }

  //顯示畫面
  function createFormHeader(apply_business_no, customer_deposit_record, form) {
	var _gw_gui_carrier_type = customer_deposit_record.getValue({fieldId: 'custbody_gw_gui_carrier_type'})
	var _gw_gui_carrier_id_1 = customer_deposit_record.getValue({fieldId: 'custbody_gw_gui_carrier_id_1'})
	var _gw_gui_carrier_id_2 = customer_deposit_record.getValue({fieldId: 'custbody_gw_gui_carrier_id_2'})
	var _gw_gui_donation_code = customer_deposit_record.getValue({fieldId: 'custbody_gw_gui_donation_code'})
	 	  
	/////////////////////////////////////////////////////////////
    //load company information
    var _seller_obj = getSellerInfo(apply_business_no)
    var _taxid = _seller_obj.tax_id_number
    var _companyname = _seller_obj.be_gui_title
    var _mainaddress_text = _seller_obj.business_address
    //暫借欄位做統編
    var _ban = _taxid
    var _legalname = _companyname 
 
    /////////////////////////////////////////////////////////////
    var _row01_fieldgroupid = form.addFieldGroup({
      id: 'row01_fieldgroupid',
      label: '憑證資訊',
    })

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
    _company_name.updateBreakType({
      breakType: serverWidget.FieldBreakType.STARTROW,
    })

    _company_ban.defaultValue = _ban
    _company_address.defaultValue = _mainaddress_text
    _company_name.defaultValue = _legalname
    /////////////////////////////////////////////////////////////
    //發票類型
    var _invoice_type = form.addField({
      id: 'custpage_invoice_type',
      type: serverWidget.FieldType.SELECT,
      label: '發票類型',
      container: 'row01_fieldgroupid',
    })
    _invoice_type.addSelectOption({
      value: '07',
      text: '一般稅發票',
    })

    //印表機類別
    var _print_type = form.addField({
      id: 'custpage_print_type',
      type: serverWidget.FieldType.TEXT,
      label: '印表機類別',
      container: 'row01_fieldgroupid',
    })
    _print_type.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    //發票資料格式
    var _mig_type = form.addField({
      id: 'custpage_mig_type',
      type: serverWidget.FieldType.SELECT,
      label: '發票資料格式',
      container: 'row01_fieldgroupid',
    })
    _mig_type.addSelectOption({
      value: 'B2C',
      text: '存證',
    })
    //發票備註
    var _main_remark = form.addField({
      id: 'custpage_main_remark',
      type: serverWidget.FieldType.TEXT,
      label: '發票備註',
      container: 'row01_fieldgroupid',
    })
    _main_remark.defaultValue = customer_deposit_record.getValue({fieldId: 'custbody_gw_gui_main_memo'}) || ''
    //字軌使用方式 _defaultAssignLogType
    var _selectDeductionPeriod = form.addField({
      id: 'custpage_allowance_log_type',
      type: serverWidget.FieldType.SELECT,
      label: '是否上傳憑證',
      container: 'row01_fieldgroupid',
    })
    _selectDeductionPeriod.addSelectOption({
      value: 'EGUI',
      text: '上傳',
    })
    _selectDeductionPeriod.addSelectOption({
      value: 'NONE',
      text: '不上傳',
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //客戶名稱 
    var _customer_id = form.addField({
      id: 'custpage_customer_id',
      type: serverWidget.FieldType.SELECT,
      label: '客戶代碼',
      source: 'CUSTOMER',
      container: 'row01_fieldgroupid'
    })  
    _customer_id.updateBreakType({
      breakType: serverWidget.FieldBreakType.STARTCOL,
    })
    _customer_id.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
    //公司統編
    var _buyer_identifier = form.addField({
      id: 'custpage_buyer_identifier',
      type: serverWidget.FieldType.TEXT,
      label: '買方公司統編',
      container: 'row01_fieldgroupid',
    })
    _buyer_identifier.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
    //公司名稱
    var _buyer_name = form.addField({
      id: 'custpage_buyer_name',
      type: serverWidget.FieldType.TEXT,
      label: '買方公司名稱',
      container: 'row01_fieldgroupid',
    })
    _buyer_name.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
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
    ////////////////////////////////////////////////////////////////////////////////////////////////
    //載具類別
    var _carrier_type_field = form.addField({
      id: 'custpage_carrier_type',
      type: serverWidget.FieldType.SELECT,
      label: '載具類別',
      container: 'row01_fieldgroupid',
    })
    _carrier_type_field.addSelectOption({
      value: '',
      text: '-----',
    })
    ////////////////////////////////////////////////////////////////////
    var _all_carry_types = carriertypedao.getAll()
    log.debug('get _all_carry_types', JSON.stringify(_all_carry_types))
    for (var i = 0; i < _all_carry_types.length; i++) {
      var _carry_json_obj = _all_carry_types[i]
      var _carry_text = _carry_json_obj.text
      var _carry_id = _carry_json_obj.id

      _carrier_type_field.addSelectOption({
        value: _carry_id,
        text: _carry_text
      })
    }
    //////////////////////////////////////////////////////////////////// 
	_carrier_type_field.updateBreakType({
      breakType: serverWidget.FieldBreakType.STARTCOL,
    })
    _carrier_type_field.defaultValue=_gw_gui_carrier_type

    //載具號碼
    var _carrier_id_1_field = form.addField({
      id: 'custpage_carrier_id_1',
      type: serverWidget.FieldType.TEXT,
      label: '載具號碼-1',
      container: 'row01_fieldgroupid',
    })
    _carrier_id_1_field.defaultValue=_gw_gui_carrier_id_1
    var _carrier_id_2_field = form.addField({
        id: 'custpage_carrier_id_2',
        type: serverWidget.FieldType.TEXT,
        label: '載具號碼-2',
        container: 'row01_fieldgroupid',
      })
      _carrier_id_2_field.defaultValue=_gw_gui_carrier_id_2
   	
    //捐贈碼
    var _npo_ban_field = form.addField({
      id: 'custpage_npo_ban',
      type: serverWidget.FieldType.TEXT,
      label: '捐贈碼',
      container: 'row01_fieldgroupid',
    })
    _npo_ban_field.defaultValue=_gw_gui_donation_code
    //通關註記
    var _customs_clearance_mark = form.addField({
      id: 'custpage_customs_clearance_mark',
      type: serverWidget.FieldType.SELECT,
      label: '通關註記',
      container: 'row01_fieldgroupid',
    })
    _customs_clearance_mark.addSelectOption({
      value: '1',
      text: '經海關',
    })
    _customs_clearance_mark.addSelectOption({
      value: '2',
      text: '不經海關',
    })
    _customs_clearance_mark.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })

    //課稅別
    var _tax_type = form.addField({
      id: 'custpage_tax_type',
      type: serverWidget.FieldType.SELECT,
      label: '課稅別',
      container: 'row01_fieldgroupid',
    })
    _tax_type.addSelectOption({
      value: '1',
      text: '應稅(一般稅率)',
    })
    _tax_type.addSelectOption({
      value: '2',
      text: '零稅率',
    })
    _tax_type.addSelectOption({
      value: '3',
      text: '免稅',
    })
    _tax_type.addSelectOption({
      value: '4',
      text: '特種稅',
    })
    _tax_type.addSelectOption({
      value: '9',
      text: '混合稅',
    })
    _tax_type.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })

    //稅率
    var _tax_rate = form.addField({
      id: 'custpage_tax_rate',
      type: serverWidget.FieldType.SELECT,
      label: '稅率%',
      container: 'row01_fieldgroupid',
    })
    _tax_rate.addSelectOption({
      value: '5',
      text: '5',
    })
    _tax_rate.addSelectOption({
      value: '0',
      text: '0',
    })
    _tax_rate.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
    //////////////////////////////////////////////////////////////////////////////////////////////
    //額外備註
    var _hidden_voucher_extra_memo = form.addField({
      id: 'custpage_voucher_extra_memo',
      type: serverWidget.FieldType.RICHTEXT,
      label: 'Extra Memo',
      container: 'row01_fieldgroupid',
    })
    _hidden_voucher_extra_memo.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    //////////////////////////////////////////////////////////////////////////////////////////////
    //未稅銷售額
    var _sales_amount = form.addField({
      id: 'custpage_sales_amount',
      type: serverWidget.FieldType.TEXT,
      label: '銷售額',
      container: 'row01_fieldgroupid',
    })
    _sales_amount.updateBreakType({
      breakType: serverWidget.FieldBreakType.STARTCOL,
    })
    _sales_amount.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
    //折讓金額
    var _sales_discount_amount = form.addField({
      id: 'custpage_sales_discount_amount',
      type: serverWidget.FieldType.TEXT,
      label: '折扣金額',
      container: 'row01_fieldgroupid',
    })
    _sales_discount_amount.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    _sales_discount_amount.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })

    //總稅額
    var _tax_amount = form.addField({
      id: 'custpage_tax_amount',
      type: serverWidget.FieldType.TEXT,
      label: '稅額',
      container: 'row01_fieldgroupid',
    })
    _tax_amount.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
    //總金額
    var _total_amount = form.addField({
      id: 'custpage_total_amount',
      type: serverWidget.FieldType.TEXT,
      label: '總金額',
      container: 'row01_fieldgroupid',
    })
    _total_amount.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    })
    //憑證日期
    var _select_voucher_date = form.addField({
      id: 'custpage_select_voucher_date',
      type: serverWidget.FieldType.DATE,
      label: '憑證日期',
      container: 'row01_fieldgroupid',
    })
    ///////////////////////////////////////////////////////////////////////////////////
    //字軌使用方式
    var _row05_fieldgroupid = form.addFieldGroup({
      id: 'row05_fieldgroupid',
      label: '字軌分配條件',
    })
    //部門代碼
    var _dept_code = form.addField({
      id: 'custpage_dept_code',
      type: serverWidget.FieldType.SELECT,
      label: '發票部門',
      container: 'row05_fieldgroupid',
    })
    _dept_code.addSelectOption({
      value: '',
      text: 'NONE',
    })
    var _deptCodeSearch = search
      .create({
        type: search.Type.DEPARTMENT,
        columns: ['internalid', 'name'],
      })
      .run()
      .each(function (result) {
        var _internalid = result.id
        var _entityid = result.getValue({
          name: 'internalid',
        })
        var _name = result.getValue({
          name: 'name',
        })

        _dept_code.addSelectOption({
          value: _internalid,
          text: _internalid + '-' + _name,
        })
        return true
      })
    //類別代碼
    var _selectClassification = form.addField({
      id: 'custpage_classification',
      type: serverWidget.FieldType.SELECT,
      label: '發票分類',
      container: 'row05_fieldgroupid',
    })
    _selectClassification.addSelectOption({
      value: '',
      text: 'NONE',
    })
    var _classificationSearch = search
      .create({
        type: search.Type.CLASSIFICATION,
        columns: ['internalid', 'name'],
      })
      .run()
      .each(function (result) {
        var _internalid = result.id
        var _entityid = result.getValue({
          name: 'internalid',
        })
        var _name = result.getValue({
          name: 'name',
        })

        _selectClassification.addSelectOption({
          value: _internalid,
          text: _internalid + '-' + _name,
        })
        return true
      })

    //////////////////////////////////////////////////////////////////////
    var _row02_fieldgroupid = form.addFieldGroup({
      id: 'row02_fieldgroupid',
      label: '手開發票開立條件',
    })
    var _eguiFormatCode = form.addField({
      id: 'custpage_egui_format_code',
      type: serverWidget.FieldType.SELECT,
      label: '格式代號 *',
      container: 'row02_fieldgroupid',
    })
    _eguiFormatCode.addSelectOption({
      value: '31-01',
      text: '31-銷項三聯式[裝訂數:50張]',
    })
    _eguiFormatCode.addSelectOption({
      value: '31-05',
      text: '31-銷項電子計算機統一發票[裝訂數:50張]',
    })
    _eguiFormatCode.addSelectOption({
      value: '32-02',
      text: '32-銷項二聯式[裝訂數:50張]',
    })
    _eguiFormatCode.addSelectOption({
      value: '32-03',
      text: '32-銷項二聯式收銀機統一發票[裝訂數:250張]',
    })
    _eguiFormatCode.addSelectOption({
      value: '35-06',
      text: '35-銷項三聯式收銀機統一發票[裝訂數:250張]',
    })
    _eguiFormatCode.addSelectOption({
      value: '35-07',
      text: '35-一般稅額電子發票[裝訂數:50張]',
      isSelected: true
    })

    //人工輸入發票號碼
    var _manual_voucher_number = form.addField({
      id: 'custpage_manual_voucher_number',
      type: serverWidget.FieldType.TEXT,
      label: '手開發票號碼',
      container: 'row02_fieldgroupid',
    })
    ///////////////////////////////////////////////////////////////////////////////////////////
    //憑證開立方式
    var _voucherOpenTypeField = form.addField({
      id: 'custpage_voucher_open_type',
      type: serverWidget.FieldType.TEXT,
      label: '憑證開立方式',
      container: 'row01_fieldgroupid',
    })
    _voucherOpenTypeField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    ///////////////////////////////////////////////////////////////////////////////////////////
  }

  function createCutomerDepositDetails(form, customer_deposit_record) {
    //處理Detail
    var sublist = form.addSublist({
      id: 'customerdepositsublistid',
      type: serverWidget.SublistType.LIST,
      label: 'NS 顧客押金商品清單',
    })
    //sublist.addMarkAllButtons();
    ////////////////////////////////////////////////////////////////////////////////////////
    var _idField = sublist.addField({
      id: 'customer_search_customerdeposit_id',
      label: 'Internal ID',
      type: serverWidget.FieldType.TEXT,
    })
    _idField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    var _numberField = sublist.addField({
      id: 'customer_search_customerdeposit_number',
      label: 'Customer Deposit Number',
      type: serverWidget.FieldType.TEXT,
    })
    _numberField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    //放dept_code
    var _deptCodeField = sublist.addField({
      id: 'customer_search_customerdeposit_deptcode',
      label: 'Internal ID',
      type: serverWidget.FieldType.TEXT,
    })
    _deptCodeField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    //放classfication
    var _classficationField = sublist.addField({
      id: 'customer_search_customerdeposit_class',
      label: 'Internal ID',
      type: serverWidget.FieldType.TEXT,
    })
    _classficationField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    ////////////////////////////////////////////////////////////////////////////////////////
    var _seqField = sublist.addField({
      id: 'customer_search_customerdeposit_seq',
      type: serverWidget.FieldType.TEXT,
      label: '順序',
    })
    var _itemNameField = sublist.addField({
      id: 'custpage_item_name',
      type: serverWidget.FieldType.TEXT,
      label: '名稱',
    })
    _itemNameField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.ENTRY,
    })

    var _taxRateNoteField = sublist.addField({
      id: 'customer_search_customerdeposit_tax_rate',
      label: '稅率%',
      type: serverWidget.FieldType.TEXT,
    })

    var _taxCodeField = sublist.addField({
      id: 'customer_search_customerdeposit_tax_code',
      label: '稅別',
      type: serverWidget.FieldType.TEXT,
    })
    _taxCodeField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })

    var _taxCodeField = sublist.addField({
      id: 'customer_search_customerdeposit_tax_code_note',
      label: '稅別',
      type: serverWidget.FieldType.TEXT,
    })

    sublist.addField({
      id: 'custpage_customerdeposit_item_unit',
      type: serverWidget.FieldType.TEXT,
      label: '單位',
    })
    sublist.addField({
      id: 'custpage_unit_price',
      type: serverWidget.FieldType.TEXT,
      label: '單價',
    })
    sublist.addField({
      id: 'custpage_item_quantity',
      type: serverWidget.FieldType.TEXT,
      label: '數量',
    })
    sublist.addField({
      id: 'custpage_item_amount',
      type: serverWidget.FieldType.TEXT,
      label: '小計(未稅)',
    })
    var _itemRemarkField = sublist.addField({
      id: 'custpage_item_remark',
      type: serverWidget.FieldType.TEXT,
      label: '明細備註',
    })
    _itemRemarkField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.ENTRY,
    })
    /////////////////////////////////////////////////////////////////////////////////////////
    //處理 Customer Deposit Item 
    //客戶id
    var _customer_id = customer_deposit_record.getValue({
      fieldId: 'customer',
    })
    //單號
    var _tranid = customer_deposit_record.getValue({
      fieldId: 'tranid',
    })
    //payment
    var _payment = customer_deposit_record.getValue({
      fieldId: 'payment',
    })
    //幣別
    var _currency = customer_deposit_record.getValue({
      fieldId: 'currency',
    })
    //費率
    var _exchangerate = customer_deposit_record.getValue({
      fieldId: 'exchangerate',
    })
    //單據日期
    var _trandate = customer_deposit_record.getValue({
      fieldId: 'trandate',
    })
    var _department = customer_deposit_record.getValue({
      fieldId: 'department',
    })
    var _class = customer_deposit_record.getValue({
      fieldId: 'class',
    })
    ///////////////////////////////////////////////////////////////////////////////////
    //客製化欄位值-Use Custom Customer Deposit
    var _custbody_gw_tax_id_number = customer_deposit_record.getValue({
      fieldId: 'custbody_gw_tax_id_number',
    })
    var _custbody_gw_gui_address = customer_deposit_record.getValue({
      fieldId: 'custbody_gw_gui_address',
    })
    var _custbody_gw_gui_title = customer_deposit_record.getValue({
      fieldId: 'custbody_gw_gui_title',
    })
    var _custbody_gw_lock_transaction = customer_deposit_record.getValue({
      fieldId: 'custbody_gw_lock_transaction',
    })     
    ///////////////////////////////////////////////////////////////////////////////////
    //稅別  
    //電子發票Tab
    var _gw_gui_tax_type = customer_deposit_record.getValue({
        fieldId: 'custbody_gw_gui_tax_type',
      }) 
    var _gw_gui_tax_rate = customer_deposit_record.getValue({
      fieldId: 'custbody_gw_gui_tax_rate',
    }) 
    ///////////////////////////////////////////////////////////////////////////////////
    var _account_name = '顧客押金' 
    var _tax_code = '1'
    var _tax_code_note = '應稅'
    var _tax_rate = '5'

    var _custpage_tax_type = form.getField({
      id: 'custpage_tax_type',
    })
    if (typeof _gw_gui_tax_type != 'undefined') {
      var _taxObj = getTaxInformation(_gw_gui_tax_type)
      
      log.debug('get taxObj', JSON.stringify(_taxObj))
      
      if (typeof _taxObj != 'undefined') {
        _tax_code = _taxObj.voucher_property_value
        _tax_code_note = _taxObj.voucher_property_note

        if (_tax_code == '1') _tax_rate = '5'
        else _tax_rate = '0'
      }
    }
    _custpage_tax_type.defaultValue = _tax_code

    var _custpage_tax_rate = form.getField({
      id: 'custpage_tax_rate',
    })
    _custpage_tax_rate.defaultValue = _tax_rate

    /////////////////////////////////////////////////////////////////////////////////////////
    //1.處理 Detail customer_search_customerdeposit_id
    sublist.setSublistValue({
      id: 'customer_search_customerdeposit_id',
      line: 0,
      value: customer_deposit_record.id,
    })
    sublist.setSublistValue({
      id: 'customer_search_customerdeposit_number',
      line: 0,
      value: _tranid,
    })
    sublist.setSublistValue({
      id: 'customer_search_customerdeposit_seq',
      line: 0,
      value: '1',
    })
    sublist.setSublistValue({
      id: 'custpage_item_name',
      line: 0,
      value: _account_name,
    })
    sublist.setSublistValue({
      id: 'customer_search_customerdeposit_tax_rate',
      line: 0,
      value: _tax_rate,
    })
    sublist.setSublistValue({
      id: 'customer_search_customerdeposit_tax_code',
      line: 0,
      value: _tax_code,
    })
    sublist.setSublistValue({
      id: 'customer_search_customerdeposit_tax_code_note',
      line: 0,
      value: _tax_code_note,
    })
    sublist.setSublistValue({
      id: 'custpage_customerdeposit_item_unit',
      line: 0,
      value: '筆',
    })

    var _amount = _payment / (1 + parseInt(_tax_rate) / 100)
    var _tax_amount = _tax_amount = _payment - _amount
 
    sublist.setSublistValue({
      id: 'custpage_unit_price',
      line: 0,
      value: _amount,
    })
    sublist.setSublistValue({
      id: 'custpage_item_quantity',
      line: 0,
      value: '1',
    })
    sublist.setSublistValue({
      id: 'custpage_item_amount',
      line: 0,
      value: _amount,
    })
    sublist.setSublistValue({
      id: 'custpage_item_remark',
      line: 0,
      value: ' ',
    })
    sublist.setSublistValue({
      id: 'custpage_invoice_item_tax_amount',
      line: 0,
      value: stringutility.trimOrAppendBlank(_tax_amount),
    })
    sublist.setSublistValue({
      id: 'custpage_invoice_item_total_amount',
      line: 0,
      value: stringutility.trimOrAppendBlank(_payment),
    })

    sublist.setSublistValue({
      id: 'custpage_invoice_total_tax_amount',
      line: 0,
      value: stringutility.trimOrAppendBlank(_tax_amount),
    })
    sublist.setSublistValue({
      id: 'custpage_invoice_total_sum_amount',
      line: 0,
      value: stringutility.trimOrAppendBlank(_payment),
    })
    /////////////////////////////////////////////////////////////////////////////////////////
    //2. Customer Deposit 日期
    var _select_voucher_date = form.getField({
      id: 'custpage_select_voucher_date',
    })
    _select_voucher_date.defaultValue = _trandate
    ////////////////////////////////////////////////////////////////////////////////////////
    //2. 處理Header的客戶資料
    //客戶代碼
    var _custpage_customer_id = form.getField({
      id: 'custpage_customer_id',
    })
    _custpage_customer_id.defaultValue = _customer_id

    var _dept_codeField = form.getField({
      id: 'custpage_dept_code',
    })
    _dept_codeField.defaultValue = _department

    var _classificationField = form.getField({
      id: 'custpage_classification',
    })
    _classificationField.defaultValue = _class

    if (_customer_id > 0) {
      var _companyObj = getCustomerInformation(_customer_id)
      if (typeof _companyObj !== 'undefined') {
        var _custpage_buyer_identifier = form.getField({
          id: 'custpage_buyer_identifier',
        })
        _custpage_buyer_identifier.defaultValue = _custbody_gw_tax_id_number

        var _custpage_buyer_name = form.getField({
          id: 'custpage_buyer_name',
        })
        _custpage_buyer_name.defaultValue = _custbody_gw_gui_title

        var _custpage_buyer_email = form.getField({
          id: 'custpage_buyer_email',
        })
        _custpage_buyer_email.defaultValue = _companyObj.email

        var _custpage_buyer_address = form.getField({
          id: 'custpage_buyer_address',
        })
        _custpage_buyer_address.defaultValue = _custbody_gw_gui_address
      }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //3.處理金額
    var _sales_amount_field = form.getField({
      id: 'custpage_sales_amount',
    })
    _sales_amount_field.defaultValue = _amount.toFixed(_numericToFixed)

    var _tax_amount_field = form.getField({
      id: 'custpage_tax_amount',
    })
    _tax_amount_field.defaultValue = _tax_amount

    var _toatl_amount_field = form.getField({
      id: 'custpage_total_amount',
    })
    _toatl_amount_field.defaultValue = _payment
    /////////////////////////////////////////////////////////////////////////////////////////
  }

  function onRequest(context) {
	var _selected_business_no = context.request.parameters.selected_businessno
	//Customer Deposit Id
    var _select_customer_deposit_id = context.request.parameters.select_customer_deposit_id
    var _customer_deposit_record = record.load({
        type: record.Type.CUSTOMER_DEPOSIT,
        id: _select_customer_deposit_id,
        isDynamic: true,
    })
      
    //Sales Order id
    var _select_sales_order_id = context.request.parameters.select_sales_order

    log.debug('get parameter','deposit_id='+_select_customer_deposit_id+' ,sales_order='+_select_sales_order_id)
    ///////////////////////////////////////////////////////////////////////////////////////////
    //處理資料
    var _select_sales_order_number = ''
    if (stringutility.trim(_select_sales_order_id) !== '') {
      //載入SALES_ORDER
      var _salesOrderRecord = record.load({
        type: record.Type.SALES_ORDER,
        id: parseInt(_select_sales_order_id),
        isDynamic: true,
      })

      _select_sales_order_number = _salesOrderRecord.getValue({
        fieldId: 'tranid',
      })
    }
    ///////////////////////////////////////////////////////////////////////////////////////////
    //做畫面-START
    ///////////////////////////////////////////////////////////////////////////////////////////
    var form = serverWidget.createForm({
      title: '電子發票開立作業（顧客押金-憑證開立）',
    })
    //Hiddent Element
    var _hiddenfield = form.addField({
      id: 'custpage_customer_deposit_hiddent_buttontype',
      type: serverWidget.FieldType.TEXT,
      label: 'HIDDEN',
    })
    _hiddenfield.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    //押金List
    var _hiddencustomerdepositlistld = form.addField({
      id: 'custpage_customer_deposit_hiddent_listid',
      type: serverWidget.FieldType.TEXT,
      label: 'HIDDEN',
    })
    _hiddencustomerdepositlistld.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    _hiddencustomerdepositlistld.defaultValue = _select_customer_deposit_id
    //紀錄 Sales Order ID
    var _hiddensalesorderlistld = form.addField({
      id: 'custpage_customer_salesorder_hiddent_listid',
      type: serverWidget.FieldType.TEXT,
      label: 'HIDDEN',
    })
    _hiddensalesorderlistld.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    _hiddensalesorderlistld.defaultValue = _select_sales_order_id
    var _hiddensalesordernumberlistld = form.addField({
      id: 'custpage_customer_salesordernumber_hiddent_listid',
      type: serverWidget.FieldType.TEXT,
      label: 'HIDDEN',
    })
    _hiddensalesordernumberlistld.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    })
    _hiddensalesordernumberlistld.defaultValue = _select_sales_order_number

    //////////////////////////////////////////////////////////////////////////////////////////
    _taxObjAry = loadAllTaxInformation()
    /////////////////////////////////////////////////////////////////////////////////////////
     
    createFormHeader(_selected_business_no, _customer_deposit_record, form)

    if (_select_customer_deposit_id != null) {
      var _idAry = _select_customer_deposit_id.split(',')
      if (_idAry.length != 0) {
        createCutomerDepositDetails(form, _customer_deposit_record)
      }
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    //status, yearMonth, deptCode
    form.addButton({
      id: 'custpage_create_voucher_button',
      label: '開立憑證',
      functionName:
        'submitDocument("' +
        _invoiceActionScriptId +
        '","' +
        _invoiceActionDeploymentId +
        '")',
    })
    form.addButton({
      id: 'custpage_forward_back_button',
      label: '回前一頁',
      functionName: 'backToPage()',
    })
    ////////////////////////////////////////////////////////////////////////////////////////////
    //做畫面-END
    ///////////////////////////////////////////////////////////////////////////////////////////

    form.clientScriptModulePath = './gw_deposit_ui_event.js'
    context.response.writePage(form)
  } //End onRequest

  return {
    onRequest: onRequest,
  }
})