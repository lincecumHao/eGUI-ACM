define(['N/runtime','N/record','../gw_common_utility/gw_common_invoice_utility'], function (runtime, record, invoiceutility) {
  /**
   * @NApiVersion 2.1
   * @NScriptType UserEventScript
   * @NModuleScope Public
   */
  var exports = {}

  function beforeLoad(context) {
    var frm = context.form
    
	//手開發票指定狀態
    var _manual_evidence_status_value = invoiceutility.getManualOpenID()
    //NE-251
    var _gw_evidence_status_value = 'A'
	
    var _current_record = context.newRecord
	
    var _lock_transaction = _current_record.getValue({
      fieldId: 'custbody_gw_lock_transaction',
    })
	var _subsidiary = _current_record.getValue({
		  fieldId: 'subsidiary',
	})	
	//20211006 walter modify
	var _gw_is_issue_egui = _current_record.getValue({
	      fieldId: 'custbody_gw_is_issue_egui',
	})
	var _gw_evidence_issue_status_id = _current_record.getValue({
	      fieldId: 'custbody_gw_evidence_issue_status',
	}) 
	//NE-251 
	if (_gw_evidence_issue_status_id !=null && _gw_evidence_issue_status_id !='') {
		var _evidence_status_record = record.load({
	        type: 'customrecord_gw_evidence_status',
	        id: _gw_evidence_issue_status_id,
	        isDynamic: true
	    })  
        _gw_evidence_status_value = _evidence_status_record.getValue({fieldId: 'custrecord_gw_evidence_status_value'})
	}
	
	var _auth = false;
	var _user_obj    = runtime.getCurrentUser()
	var _company_ary = invoiceutility.getBusinessEntitByUserId(_user_obj.id, _subsidiary)
	if (_company_ary!=null) {
    	for (var i=0; i<_company_ary.length; i++) {
    		var _company = _company_ary[i];
			if (parseInt(_subsidiary) == parseInt(_company.subsidiary)) {
				_auth = true;break;
			}    		 
    	}
    } 
    //NE-419
	var triangularTrade = getTriangularTrade(_current_record)
	
    log.debug('lock_transaction', 'lock_transaction:' + _lock_transaction)
	log.debug('auth', 'auth:' + _auth)
	log.debug('gw_is_issue_egui', 'gw_is_issue_egui:' + _gw_is_issue_egui)
	log.debug('gw_evidence_status_value', _gw_evidence_status_value)
	log.debug('triangularTrade', triangularTrade)
	
    if (
      context.type == context.UserEventType.VIEW &&
	  _auth == true &&
	  _gw_evidence_status_value == _manual_evidence_status_value &&
	  _gw_is_issue_egui == true &&
	  triangularTrade == false &&
      _lock_transaction == false
    ) {
      frm.addButton({
        id: 'custpage_invoice_egui_edit_btn',
        label: '開立發票',
        functionName: 'onButtonClickForEGUI()',
      })
    }

    frm.clientScriptModulePath = './gw_invoice_open_voucher_event.js'
  }
  
  //NE-419
  function getTriangularTrade(_record) {	  
	  var triangularTrade = false
	  var numLines = _record.getLineCount({sublistId: 'item'})
	  log.debug('numLines', numLines )
	  
	  for(var j=0; j<numLines; j++) { 
		  var cseg_ntt_sales_type_id = _record.getSublistValue({
			    sublistId: 'item',
			    fieldId: 'cseg_ntt_sales_type',
			    line: j
		  });
		  var cseg_ntt_sales_type_text = _record.getSublistText({
			    sublistId: 'item',
			    fieldId: 'cseg_ntt_sales_type',
			    line: j
		  });
		  if (cseg_ntt_sales_type_text == '三角貿易') {
			  triangularTrade = true
		  }		  
		  //'line.cseg_ntt_sales_type'  
		  log.debug('cseg_ntt_sales_type', 'id:'+cseg_ntt_sales_type_id+', text:'+cseg_ntt_sales_type_text )
	  }
	  
	  log.debug('triangularTrade', triangularTrade )
	  return triangularTrade
  }
  
  exports.beforeLoad = beforeLoad
  return exports
})
