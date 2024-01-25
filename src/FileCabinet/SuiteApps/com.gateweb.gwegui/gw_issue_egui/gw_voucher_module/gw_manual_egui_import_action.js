/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define([  
  'N/runtime',
  'N/file',  
  'N/search',
  'N/record',
  'N/format', 
  'N/redirect',
  '../gw_common_utility/gw_common_date_utility',
  '../gw_common_utility/gw_common_invoice_utility',
  '../gw_common_utility/gw_common_string_utility',
  '../gw_common_utility/gw_common_configure',
], function ( 
  runtime,
  file, 
  search,
  record,
  format,  
  redirect,
  dateutility,
  invoiceutility,
  stringutility,
  gwconfigure
) {
  var _voucher_apply_list_record_id = gwconfigure.getGwVoucherApplyListRecord()
  var _voucher_main_record_id = gwconfigure.getGwVoucherMainRecord()
  var _remaining_usage_limit = 50
  var _limit_count = 1000
    
  function saveVoucherApplyListRecord(line_value) {
	    var _apply_id    = 0
	    var _line_values = line_value.split(',') 
	    var _seller_ban  = _line_values[0]
	    var _buyer_ban   = _line_values[1]
	    var _customer_id = _line_values[2]
	    var _mig_type    = _line_values[14]
	    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	    //this_period:當期, early_period:前期
	    var _open_type = 'SINGLE-MANUAL-VOUCHER'
	    var _voucher_apply_atatus = 'P'
	    var _closed_voucher = 'N'

	    var _voucher_apply_record = record.create({
	      type: _voucher_apply_list_record_id,
	      isDynamic: true,
	    })

	    _voucher_apply_record.setValue({ fieldId: 'name', value: 'VoucherApply' })
	    _voucher_apply_record.setValue({
	      fieldId: 'custrecord_gw_voucher_apply_type',
	      value: 'APPLY',
	    }) //APPLY (開立) / VOID (作廢)
	    _voucher_apply_record.setValue({
	      fieldId: 'custrecord_gw_voucher_open_type',
	      value: _open_type,
	    })
	    _voucher_apply_record.setValue({
	      fieldId: 'custrecord_gw_voucher_apply_seller',
	      value: _seller_ban,
	    }) 
	    _voucher_apply_record.setValue({
	      fieldId: 'custrecord_gw_voucher_apply_buyer',
	      value: _buyer_ban,
	    }) 
        _voucher_apply_record.setValue({
	      fieldId: 'custrecord_gw_voucher_apply_mig_type',
	      value: _mig_type,
	    }) 
	    _voucher_apply_record.setValue({
	      fieldId: 'custrecord_gw_closed_voucher',
	      value: _closed_voucher,
	    })
        _voucher_apply_record.setValue({
	      fieldId: 'custrecord_gw_need_upload_mig',
	      value: 'NONE',
	    })
	    try {
	    	 _apply_id = _voucher_apply_record.save()
	    } catch (e) {
	    	 log.error(e.name, e.message)
	    }

	    return _apply_id
  }
  
  function saveVoucherMain (apply_id, line_value) { 
	  var _line_values = line_value.split(',')  
	  //賣方公司統編	買方公司統編	客戶代碼	格式代號	開立日期	發票號碼	稅別	稅率	銷售金額(未稅)	免稅銷售金額	零稅銷售金額	已折金額(應稅):未稅	已折金額(零稅)	已折金額(免稅)
	  var _seller_ban                 = _line_values[0]
	  var _buyer_ban                  = _line_values[1]
	  var _customer_id                = _line_values[2]
	  var _format_code_str            = _line_values[3] //31-05
	  var _voucher_date               = _line_values[4]
	  var _egui_number                = _line_values[5]
	  var _tax_type                   = _line_values[6]
	  var _tax_rate                   = _line_values[7]
	  var _sales_amount               = _line_values[8]
	  var _free_sales_amount          = _line_values[9]
	  var _zero_sales_amount          = _line_values[10]
	  var _sales_discount_amount      = _line_values[11]
	  var _free_sales_discount_amount = _line_values[12]
	  var _zero_discount_amount       = _line_values[13]
	  var _mig_type                   = _line_values[14]
	  
	  var _total_discount_amount = stringutility.convertToFloat(_sales_discount_amount) +
							       stringutility.convertToFloat(_free_sales_discount_amount) +
							       stringutility.convertToFloat(_zero_discount_amount) 
	  /////////////////////////////////////////////////////////////////////
	  //Save To Voucher Main And Detail
	  var _voucher_type = 'EGUI'
      var _status = 'VOUCHER_SUCCESS' //2:開立成功, 3:作廢成功
      var _default_upload_status = 'C' 
    	  
      var _format_code_ary = _format_code_str.split('-')
      var _format_code = _format_code_ary[0]
	  var _invoice_type = _format_code_ary[1]
	  
	  var _tax_amount = Math.round(stringutility.convertToFloat(_sales_amount) * 
	                               stringutility.convertToFloat(_tax_rate) / 100)
	                               
      var _total_amount = stringutility.convertToFloat(_sales_amount) +
					      stringutility.convertToFloat(_free_sales_amount) +
					      stringutility.convertToFloat(_zero_sales_amount) +
                          _tax_amount	  
       
      var _formattedDate = format.format({
          value: _voucher_date,
          type: format.Type.DATE,
          timezone: format.Timezone.ASIA_TAIPEI,
      })                    
      var _year_month = dateutility.getTaxYearMonthByDate(_formattedDate)
      var _apply_period = invoiceutility.getApplyPeriodOptionId(_year_month)
    	  
	  var _voucher_main_record = record.create({
            type: _voucher_main_record_id,
            isDynamic: true
          })
          
      _voucher_main_record.setValue({
          fieldId: 'name',
          value: 'VoucherMainRecord'
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_apply_internal_id',
          value: apply_id.toString()
      })
	  _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_voucher_type',
          value: _voucher_type,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_voucher_number',
          value: _egui_number,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_voucher_date',
          value: convertVoucherDate(_voucher_date),
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_voucher_time',
          value: '23:59:59',
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_voucher_yearmonth',
          value: _year_month,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_seller',
          value: _seller_ban,
      }) 
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_seller_name',
          value: _seller_ban,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_buyer',
          value: _buyer_ban,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_buyer_name',
          value: _buyer_ban,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_invoice_type',
          value: stringutility.trim(_invoice_type),
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_mig_type',
          value: _mig_type,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_voucher_format_code',
          value: _format_code,
      })  
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_discount_sales_amount',
          value: _sales_discount_amount,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_discount_free_amount',
          value: _free_sales_discount_amount,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_discount_zero_amount',
          value: _zero_discount_amount,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_discount_amount',
          value: _total_discount_amount,
      })
      if (_total_discount_amount != 0) {
    	  _voucher_main_record.setValue({
	        fieldId: 'custrecord_gw_discount_count',
	        value: '1',
	      })
	  } else {
		  _voucher_main_record.setValue({
	        fieldId: 'custrecord_gw_discount_count',
	        value: '0',
	      })
	  }
	  _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_voucher_status',
          value: _status,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_voucher_upload_status',
          value: _default_upload_status,
      })  
	  _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_sales_amount',
          value: _sales_amount,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_free_sales_amount',
          value: _free_sales_amount,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_zero_sales_amount',
          value: _zero_sales_amount,
      })
      _voucher_main_record.setValue({
	      fieldId: 'custrecord_gw_tax_amount',
	      value: _tax_amount,
	  })
	  _voucher_main_record.setValue({
	      fieldId: 'custrecord_gw_tax_type',
	      value: _tax_type,
	  })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_tax_rate',
          value: _tax_rate,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_total_amount',
          value: _total_amount,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_need_upload_egui_mig',
          value: 'NONE',
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_is_manual_voucher',
          value: true,
      })
      _voucher_main_record.setValue({
          fieldId: 'custrecord_gw_original_buyer_id',
          value: _customer_id,
      })   
      _voucher_main_record.setValue({
          fieldId: 'custrecord_voucher_sale_tax_apply_period',
          value: _apply_period,
      })   
      
	  /////////////////////////////////////////////////////////////////////	
      
      return _voucher_main_record
  }
  
  function saveVoucherDetail (line_value, voucher_main_record) { 
	  log.debug('saveVoucherDetail', line_value)
	  var _line_values = line_value.split(',')  
	  //賣方公司統編	買方公司統編	客戶代碼	格式代號	開立日期	發票號碼	稅別	稅率	銷售金額(未稅)	免稅銷售金額	零稅銷售金額	已折金額(應稅):未稅	已折金額(零稅)	已折金額(免稅)
	  var _seller_ban                 = _line_values[0]
	  var _buyer_ban                  = _line_values[1]
	  var _customer_id                = _line_values[2]
	  var _format_code                = _line_values[3]
	  //var _voucher_date               = _line_values[4]
	  //var _egui_number                = _line_values[5]
	  var _tax_type                   = _line_values[6]
	  var _tax_rate                   = _line_values[7]
	  var _sales_amount               = _line_values[8]
	  var _free_sales_amount          = _line_values[9]
	  var _zero_sales_amount          = _line_values[10]
	  var _sales_discount_amount      = _line_values[11]
	  var _free_sales_discount_amount = _line_values[12]
	  var _zero_discount_amount       = _line_values[13]
	   
	  /////////////////////////////////////////////////////////////////////
	  //Save To Voucher Main And Detail
	  var _status = 'VOUCHER_SUCCESS' //2:開立成功, 3:作廢成功
      var _default_upload_status = 'C'
	  var _voucher_detail_sublistId = 'recmachcustrecord_gw_voucher_main_internal_id'
	  var _main_record_id = '0'
	  var _seq = 1
	  ///////////////////////////////////////////////////////////////////////////////
	  var _amount_ary = []
	  if (stringutility.convertToFloat(_sales_amount) != 0) {
		  var _json_obj = {'item_name':'應稅商品', 'amount':_sales_amount, 'tax_rate':_tax_rate ,'tax_type':'1'}
		  _amount_ary.push(_json_obj)
	  }
	  if (stringutility.convertToFloat(_free_sales_amount) != 0) {
		  var _json_obj = {'item_name':'免稅商品', 'amount':_free_sales_amount, 'tax_rate':'0' ,'tax_type':'3'}
		  _amount_ary.push(_json_obj)
	  }
	  if (stringutility.convertToFloat(_zero_sales_amount) != 0) {
		  var _json_obj = {'item_name':'零稅商品', 'amount':_zero_sales_amount, 'tax_rate':'0' ,'tax_type':'2'}
		  _amount_ary.push(_json_obj)
	  }
	   
	  //////////////////////////////////////////////////////////////////////////////	  
	  for(var _seq=0; _seq<_amount_ary.length; _seq++) {	 
		  var _json_obj = _amount_ary[_seq]
		  var _item_amount   = _json_obj.amount
		  var _item_tax_type = _json_obj.tax_type
		  var _item_tax_rate = _json_obj.tax_rate
		  var _item_name     = _json_obj.item_name
		  
		  var _item_tax_amount = Math.round(stringutility.convertToFloat(_item_amount) * 
                                            stringutility.convertToFloat(_item_tax_rate) / 100)
                  
	  	  var _item_total_amount = stringutility.convertToFloat(_item_amount) + _item_tax_amount	 
		  
		  var _unit_price = _item_amount
		  
	      voucher_main_record.selectNewLine({
	          sublistId: _voucher_detail_sublistId
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'name',
	        value: 'VoucherDetailRecord'
	      })      
	      var _apply_id = voucher_main_record.getValue({fieldId: 'custrecord_gw_apply_internal_id'})      
		  voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_apply_internal_id',
	        value: _apply_id
	      })
	      /////////////////////////////////////////////////////////////////////
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'name',
	        value: 'VoucherDetailRecord'
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_voucher_main_internal_id',
	        value: _main_record_id
	      }) 
	      
	      var _voucher_type = voucher_main_record.getValue({fieldId: 'custrecord_gw_voucher_type'}) 
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_voucher_type',
	        value: _voucher_type
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_item_description',
	        value: _item_name
	      })  
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_unit_price',
	        value: _unit_price
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_item_unit',
	        value: 'UNIT'
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_item_quantity',
	        value: '1'
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_item_amount',
	        value: _item_amount
	      }) 
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_item_tax_amount',
	        value: _item_tax_amount
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_item_total_amount',
	        value: _item_total_amount
	      }) 
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_item_tax_rate',
	        value: _item_tax_rate
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_item_seq',
	        value: _seq+1
	      })
	      
	      var _egui_number  = voucher_main_record.getValue({fieldId: 'custrecord_gw_voucher_number'}) 
	      var _voucher_date = voucher_main_record.getValue({fieldId: 'custrecord_gw_voucher_date'}) 
	      var _year_month   = voucher_main_record.getValue({fieldId: 'custrecord_gw_voucher_yearmonth'}) 
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_voucher_number',
	        value: _egui_number
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_voucher_date',
	        value: _voucher_date.toString()
	      }) 
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_voucher_time',
	        value: '23:59:59'
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_voucher_yearmonth',
	        value: _year_month
	      }) 
	      
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_voucher_status',
	        value: _status
	      })
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_voucher_upload_status',
	        value: _default_upload_status
	      })   
	      var _voucher_apply_period  = voucher_main_record.getValue({fieldId: 'custrecord_voucher_sale_tax_apply_period'}) 
	      voucher_main_record.setCurrentSublistValue({
	        sublistId: _voucher_detail_sublistId,
	        fieldId: 'custrecord_gw_dtl_voucher_apply_period',
	        value: _voucher_apply_period
	      })   
	       log.debug('commitLine', line_value)
	      voucher_main_record.commitLine({
	        sublistId: _voucher_detail_sublistId
	      })      
	  }
      /////////////////////////////////////////////////////////////////////	  
      voucher_main_record.setValue({
        fieldId: 'custrecord_gw_is_completed_detail',
        value: true
      })
	  /////////////////////////////////////////////////////////////////////	  
      try {
           voucher_main_record.save() 
      } catch (e) { 
    	   log.error(e.name, e.message)
      }
       
      var _seller       = voucher_main_record.getValue({fieldId: 'custrecord_gw_seller'}) 
      var _invoice_type = voucher_main_record.getValue({fieldId: 'custrecord_gw_invoice_type'}) 
      var _format_code  = voucher_main_record.getValue({fieldId: 'custrecord_gw_voucher_format_code'}) 
      var _egui_number  = voucher_main_record.getValue({fieldId: 'custrecord_gw_voucher_number'}) 
      var _voucher_date = voucher_main_record.getValue({fieldId: 'custrecord_gw_voucher_date'}) 
      var _year_month   = voucher_main_record.getValue({fieldId: 'custrecord_gw_voucher_yearmonth'}) 
      
      updateAssignLog(_seller, _invoice_type, _format_code, _year_month, _egui_number ,_voucher_date)
  }
  
  function updateAssignLog(ban, invoice_type, format_code, year_month, voucher_number, voucher_date) {
	  try {		  
		  var _assignLogSearch = search.create({
		      type: 'customrecord_gw_assignlog',
		      columns: [
		        search.createColumn({ name: 'internalid' }),
		        search.createColumn({ name: 'name' }),
		        search.createColumn({ name: 'custrecord_gw_assignlog_lastinvnumbe' }),
		        search.createColumn({ name: 'custrecord_gw_assignlog_startno' }),
		        search.createColumn({ name: 'custrecord_gw_assignlog_endno' }),
		        search.createColumn({ name: 'custrecord_gw_assignlog_usedcount' }),
		        search.createColumn({ name: 'custrecord_gw_last_invoice_date' }) 
		      ]
		    })

		    var _filterArray = []
		    _filterArray.push(['custrecord_gw_assignlog_businessno', search.Operator.IS, ban])
		    _filterArray.push('and')
		    _filterArray.push(['custrecord_gw_egui_format_code', search.Operator.IS, format_code])
		    _filterArray.push('and')
		    _filterArray.push(['custrecord_gw_assignlog_invoicetype', search.Operator.IS, invoice_type])
		    _filterArray.push('and')
		    _filterArray.push(['custrecord_gw_assignlog_yearmonth', search.Operator.IS, year_month])
		    
		    var _invoice_track       = voucher_number.substring(0,2)
		    var _index_invoice_number = parseInt(voucher_number.substring(2,voucher_number.length))
		    
		    _filterArray.push('and')
		    _filterArray.push(['custrecord_gw_assignlog_invoicetrack', search.Operator.IS, _invoice_track])
		    
		    _filterArray.push('and')
		    _filterArray.push(['custrecord_gw_assignlog_startno', search.Operator.LESSTHANOREQUALTO, _index_invoice_number])		    
		    _filterArray.push('and')
		    _filterArray.push(['custrecord_gw_assignlog_endno', search.Operator.GREATERTHANOREQUALTO, _index_invoice_number])
   
		    /**
            _filterArray.push([
            	              ['custrecord_gw_assignlog_status', search.Operator.IS, '21'],
						        'or',
						        ['custrecord_gw_assignlog_status', search.Operator.IS, '22']
						      ])
			*/	      
			//alert('_filterArray:' + JSON.stringify(_filterArray))			      
		    _assignLogSearch.filterExpression = _filterArray
		    
		    var _assignLogSearchResult = _assignLogSearch.run().getRange({start: 0, end: 1})
		     //alert('_assignLogSearchResult.length:' + _assignLogSearchResult.length)
		    for (var i = 0; i < _assignLogSearchResult.length; i++) {
		         var _internal_id = _assignLogSearchResult[i].id
		         var _assignlog_startno = _assignLogSearchResult[i].getValue({name: 'custrecord_gw_assignlog_startno'})
		         var _assignlog_endno = _assignLogSearchResult[i].getValue({name: 'custrecord_gw_assignlog_endno'})
		         var _usedcount = _assignLogSearchResult[i].getValue({name: 'custrecord_gw_assignlog_usedcount'})
			      		      
		         var _last_invoice_number = _assignLogSearchResult[i].getValue({name: 'custrecord_gw_assignlog_lastinvnumbe'})
		         var _check_invoice_number = 0
		         if (_last_invoice_number!=''){
		        	 _check_invoice_number = parseInt(_last_invoice_number)
		         }
		         if (_index_invoice_number >= _check_invoice_number){	 
		        	 var values = {}
                     
                     values['custrecord_gw_last_invoice_date'] = voucher_date                     
                     values['custrecord_gw_assignlog_usedcount'] = _index_invoice_number-_assignlog_startno+1
                     
                     _index_invoice_number = padding('' + _index_invoice_number, 8)
                     values['custrecord_gw_assignlog_lastinvnumbe'] = _index_invoice_number
                                          
                     if(_index_invoice_number == _assignlog_endno){
                     	values['custrecord_gw_assignlog_status'] = '23'
                     }
                     
		        	 var _id = record.submitFields({
			                type: 'customrecord_gw_assignlog',
			                id: _internal_id,
			                values: values,
			                options: {
			                  enableSourcing: false,
			                  ignoreMandatoryFields: true
			                }
		              })
		         }		         
		    }
            
      } catch (e) {
           console.log(e.name + ':' + e.message)
      }
  }
  
  function padding(str, length) {
    return (Array(length).join('0') + str).slice(-length)
  }
  
  function convertVoucherDate (voucher_date) { 
	  var _temp_ary = voucher_date.split('/')
	  var _year  = _temp_ary[0]
	  var _month = _temp_ary[1]
	  var _day   = _temp_ary[2]
	  if (stringutility.convertToFloat(_month)<10)_month='0'+stringutility.convertToInt(_month)
	  if (stringutility.convertToFloat(_day)  <10)_day='0'+stringutility.convertToInt(_day)
	  
	  return _year+''+_month+''+_day
  }
  
  function forwardToNextSuitelet (next_script_id, next_deployment_id, temp_file_id, message, temp_count) { 
	  var _params = {
		            'saved_temp_file_result' : message,
		            'saved_temp_file_id' : temp_file_id,
		            'saved_temp_count'   : temp_count,
	                }
	  redirect.toSuitelet({
	      scriptId: next_script_id,
	      deploymentId: next_deployment_id,
	      parameters : _params
	  })
  }
  
  function onRequest(context) { 
    var _temp_file_id    = context.request.parameters.temp_file_id 
    var _temp_file_index = context.request.parameters.temp_file_index 
    log.debug('temp_file_id', _temp_file_id)
    log.debug('temp_file_index', _temp_file_index)
     
    try {
         //1.Load File From Temp Folder
    	 var _file_obj = file.load({ 'id': _temp_file_id });
    	 var _iterator = _file_obj.lines.iterator()	  
         // Skip the first line, which is the CSV header line
    	 for (var i=0; i<_temp_file_index; i++) {
    		  _iterator.each(function () {
                 return false
              })
    	 } 
         
         //2.Access Data
         var _count = _temp_file_index - 1
         var _apply_id = -1	   
         var _forward_to_self = false
          
		 _iterator.each(function (line) { 	
		      //log.debug('get line.value', line.value) 
		      //log.debug('count is', _count) 
		      
		      var _remaining_usage = runtime.getCurrentScript().getRemainingUsage()
		      //log.debug('remaining_usage', _remaining_usage) 
		      
		      if (_forward_to_self == false) {
			      if (_remaining_usage <= _remaining_usage_limit && _count <= _limit_count) {
			    	  _count++
			    	  _forward_to_self = true		    	 
			      } else {		      
				      if (_apply_id==-1) {
				          _apply_id = saveVoucherApplyListRecord(line.value)
				      }
				       
				      var _voucher_main_record = saveVoucherMain(_apply_id, line.value)
			          saveVoucherDetail(line.value, _voucher_main_record)
				    
			          _count++
			      }
		      }
		      //_remaining_usage = 40
		      return true
		 })  
		 
		 if (_forward_to_self == true) {
			 var _params = {
					        'temp_file_id' : _temp_file_id,
					        'temp_file_index' : _count
				           }
			 redirect.toSuitelet({
		         scriptId: 'customscript_gw_manual_egui_import_actio',
		         deploymentId: 'customdeploy_gw_manual_egui_import_actio',
		         parameters : _params
		     }) 
		 } else {
			 //3.Delete Temp File
	         file.delete({ id: _temp_file_id })
	         
	         //4.Forward To Apply Page
	         //log.debug('FORWARD TASK', 'START FORWARD TO IMPORT ACTION') 
	         forwardToNextSuitelet('customscript_gw_manualegui_ui_import', 
	        		               'customdeploy_gw_manualegui_ui_import', 
	        		               _temp_file_id, 'successful', _count)
		 }
    } catch (e) {
         log.error(e.name, e.message)  
         forwardToNextSuitelet('customscript_gw_manualegui_ui_import', 
        		               'customdeploy_gw_manualegui_ui_import', 
        		               _temp_file_id, 'error', -1)
    }
  } //End onRequest

  return {
    onRequest: onRequest,
  }
})
