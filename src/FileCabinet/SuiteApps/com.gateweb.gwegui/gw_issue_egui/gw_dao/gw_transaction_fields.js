define(['../../library/ramda.min'], function (ramda) {
    /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @copyright 2023 Gateweb
     * @author Walter Chou
     *
     * @NApiVersion 2.0
     * @NModuleScope Public

     */
    var exports = {}
    var recordId = 'transaction'
    var fieldConfig = {
        mainline: {
            id: 'mainline',
            sourceField: 'mainline',
            outputField: 'mainline',
            name: 'mainline',
            join: '',
        },
        trandate: {
            id: 'trandate',
            sourceField: 'trandate',
            outputField: 'trandate',
            name: 'trandate',
            join: '',
        },
        type: {
            id: 'type',
            sourceField: 'type',
            outputField: 'type',
            name: 'type',
            join: '',
        },
        tranid: {
            id: 'tranid',
            sourceField: 'tranid',
            outputField: 'tranid',
            name: 'tranid',
            join: '',
        },
        entity: {
            id: 'entity',
            sourceField: 'entity',
            outputField: 'entity',
            name: 'entity',
            join: '',
        },
        account: {
            id: 'account',
            sourceField: 'account',
            outputField: 'account',
            name: 'account',
            join: '',
        },
        memo: {
            id: 'memo',
            sourceField: 'memo',
            outputField: 'memo',
            name: 'memo',
            join: '',
        },
        department: {
            id: 'department',
            sourceField: 'department',
            outputField: 'department',
            name: 'department',
            join: '',
        },
        class: {
            id: 'class',
            sourceField: 'class',
            outputField: 'class',
            name: 'class',
            join: '',
        },
        createdfrom: {
            id: 'createdfrom',
            sourceField: 'createdfrom',
            outputField: 'createdfrom',
            name: 'createdfrom',
            join: '',
        },
        item: {
            id: 'item',
            sourceField: 'item',
            outputField: 'item',
            name: 'item',
            join: '',
        },
        itemtype: {
            id: 'itemtype',
            sourceField: 'itemtype',
            outputField: 'itemtype',
            name: 'itemtype',
            join: '',
        },
        line: {
            id: 'line',
            sourceField: 'line',
            outputField: 'line',
            name: 'line',
            join: '',
        },
        linesequencenumber: {
            id: 'linesequencenumber',
            sourceField: 'linesequencenumber',
            outputField: 'linesequencenumber',
            name: 'linesequencenumber',
            join: '',
        },
        rate: {
            id: 'rate',
            sourceField: 'rate',
            outputField: 'rate',
            name: 'rate',
            join: '',
        },
        quantity: {
            id: 'quantity',
            sourceField: 'quantity',
            outputField: 'quantity',
            name: 'quantity',
            join: '',
        },
        amount: {
            id: 'amount',
            sourceField: 'amount',
            outputField: 'amount',
            name: 'amount',
            join: '',
        },
        total: {
            id: 'total',
            sourceField: 'total',
            outputField: 'total',
            name: 'total',
            join: '',
        },
        taxtotal: {
            id: 'taxtotal',
            sourceField: 'taxtotal',
            outputField: 'taxtotal',
            name: 'taxtotal',
            join: '',
        },
        taxamount: {
            id: 'taxamount',
            sourceField: 'taxamount',
            outputField: 'taxamount',
            name: 'taxamount',
            join: '',
        },
        custbody_gw_tax_id_number: {
            id: 'custbody_gw_tax_id_number',
            sourceField: 'custbody_gw_tax_id_number',
            outputField: 'custbody_gw_tax_id_number',
            name: 'custbody_gw_tax_id_number',
            join: '',
        },
        custbody_gw_gui_address: {
            id: 'custbody_gw_gui_address',
            sourceField: 'custbody_gw_gui_address',
            outputField: 'custbody_gw_gui_address',
            name: 'custbody_gw_gui_address',
            join: '',
        },
        custbody_gw_gui_title: {
            id: 'custbody_gw_gui_title',
            sourceField: 'custbody_gw_gui_title',
            outputField: 'custbody_gw_gui_title',
            name: 'custbody_gw_gui_title',
            join: '',
        },
        custbody_gw_lock_transaction: {
            id: 'custbody_gw_lock_transaction',
            sourceField: 'custbody_gw_lock_transaction',
            outputField: 'custbody_gw_lock_transaction',
            name: 'custbody_gw_lock_transaction',
            join: '',
        },
        custbody_gw_gui_num_start: {
            id: 'custbody_gw_gui_num_start',
            sourceField: 'custbody_gw_gui_num_start',
            outputField: 'custbody_gw_gui_num_start',
            name: 'custbody_gw_gui_num_start',
            join: '',
        },
        custbody_gw_gui_num_end: {
            id: 'custbody_gw_gui_num_end',
            sourceField: 'custbody_gw_gui_num_end',
            outputField: 'custbody_gw_gui_num_end',
            name: 'custbody_gw_gui_num_end',
            join: '',
        },        
        custbody_gw_gui_sales_amt: {
            id: 'custbody_gw_gui_sales_amt',
            sourceField: 'custbody_gw_gui_sales_amt',
            outputField: 'custbody_gw_gui_sales_amt',
            name: 'custbody_gw_gui_sales_amt',
            join: '',
        },
        custbody_gw_gui_sales_amt_tax_exempt: {
            id: 'custbody_gw_gui_sales_amt_tax_exempt',
            sourceField: 'custbody_gw_gui_sales_amt_tax_exempt',
            outputField: 'custbody_gw_gui_sales_amt_tax_exempt',
            name: 'custbody_gw_gui_sales_amt_tax_exempt',
            join: '',
        },
        custbody_gw_gui_sales_amt_tax_zero: {
            id: 'custbody_gw_gui_sales_amt_tax_zero',
            sourceField: 'custbody_gw_gui_sales_amt_tax_zero',
            outputField: 'custbody_gw_gui_sales_amt_tax_zero',
            name: 'custbody_gw_gui_sales_amt_tax_zero',
            join: '',
        },
        custbody_gw_gui_tax_amt: {
            id: 'custbody_gw_gui_tax_amt',
            sourceField: 'custbody_gw_gui_tax_amt',
            outputField: 'custbody_gw_gui_tax_amt',
            name: 'custbody_gw_gui_tax_amt',
            join: '',
        },
        custbody_gw_gui_tax_file_date: {
            id: 'custbody_gw_gui_tax_file_date',
            sourceField: 'custbody_gw_gui_tax_file_date',
            outputField: 'custbody_gw_gui_tax_file_date',
            name: 'custbody_gw_gui_tax_file_date',
            join: '',
        },
        custbody_gw_gui_tax_rate: {
            id: 'custbody_gw_gui_tax_rate',
            sourceField: 'custbody_gw_gui_tax_rate',
            outputField: 'custbody_gw_gui_tax_rate',
            name: 'custbody_gw_gui_tax_rate',
            join: '',
        },
        custbody_gw_gui_tax_type: {
            id: 'custbody_gw_gui_tax_type',
            sourceField: 'custbody_gw_gui_tax_type',
            outputField: 'custbody_gw_gui_tax_type',
            name: 'custbody_gw_gui_tax_type',
            join: '',
        },
        custbody_gw_gui_total_amt: {
            id: 'custbody_gw_gui_total_amt',
            sourceField: 'custbody_gw_gui_total_amt',
            outputField: 'custbody_gw_gui_total_amt',
            name: 'custbody_gw_gui_total_amt',
            join: '',
        },
        custbody_gw_is_issue_egui: {
            id: 'custbody_gw_is_issue_egui',
            sourceField: 'custbody_gw_is_issue_egui',
            outputField: 'custbody_gw_is_issue_egui',
            name: 'custbody_gw_is_issue_egui',
            join: '',
        },
        custbody_gw_seller_tax_id: {
            id: 'custbody_gw_seller_tax_id',
            sourceField: 'custbody_gw_seller_tax_id',
            outputField: 'custbody_gw_seller_tax_id',
            name: 'custbody_gw_seller_tax_id',
            join: '',
        },        
        custbody_gw_allowance_num_start: {
            id: 'custbody_gw_allowance_num_start',
            sourceField: 'custbody_gw_allowance_num_start',
            outputField: 'custbody_gw_allowance_num_start',
            name: 'custbody_gw_allowance_num_start',
            join: '',
        },
        custbody_gw_allowance_num_end: {
            id: 'custbody_gw_allowance_num_end',
            sourceField: 'custbody_gw_allowance_num_end',
            outputField: 'custbody_gw_allowance_num_end',
            name: 'custbody_gw_allowance_num_end',
            join: '',
        },
        custbody_gw_customs_export_category: {
            id: 'custbody_gw_customs_export_category',
            sourceField: 'custbody_gw_customs_export_category',
            outputField: 'custbody_gw_customs_export_category',
            name: 'custbody_gw_customs_export_category',
            join: '',
        },
        custbody_gw_customs_export_no: {
            id: 'custbody_gw_customs_export_no',
            sourceField: 'custbody_gw_customs_export_no',
            outputField: 'custbody_gw_customs_export_no',
            name: 'custbody_gw_customs_export_no',
            join: '',
        },
        custbody_gw_customs_export_date: {
            id: 'custbody_gw_customs_export_date',
            sourceField: 'custbody_gw_customs_export_date',
            outputField: 'custbody_gw_customs_export_date',
            name: 'custbody_gw_customs_export_date',
            join: '',
        },
        custbody_gw_egui_clearance_mark: {
            id: 'custbody_gw_egui_clearance_mark',
            sourceField: 'custbody_gw_egui_clearance_mark',
            outputField: 'custbody_gw_egui_clearance_mark',
            name: 'custbody_gw_egui_clearance_mark',
            join: '',
        },
        custbody_gw_applicable_zero_tax: {
            id: 'custbody_gw_applicable_zero_tax',
            sourceField: 'custbody_gw_applicable_zero_tax',
            outputField: 'custbody_gw_applicable_zero_tax',
            name: 'custbody_gw_applicable_zero_tax',
            join: '',
        },
        custbody_gw_gui_carrier_type: {
            id: 'custbody_gw_gui_carrier_type',
            sourceField: 'custbody_gw_gui_carrier_type',
            outputField: 'custbody_gw_gui_carrier_type',
            name: 'custbody_gw_gui_carrier_type',
            join: '',
        },
        custbody_gw_gui_carrier_id_1: {
            id: 'custbody_gw_gui_carrier_id_1',
            sourceField: 'custbody_gw_gui_carrier_id_1',
            outputField: 'custbody_gw_gui_carrier_id_1',
            name: 'custbody_gw_gui_carrier_id_1',
            join: '',
        },
        custbody_gw_gui_carrier_id_2: {
            id: 'custbody_gw_gui_carrier_id_2',
            sourceField: 'custbody_gw_gui_carrier_id_2',
            outputField: 'custbody_gw_gui_carrier_id_2',
            name: 'custbody_gw_gui_carrier_id_2',
            join: '',
        },
        custbody_gw_gui_donation_mark: {
            id: 'custbody_gw_gui_donation_mark',
            sourceField: 'custbody_gw_gui_donation_mark',
            outputField: 'custbody_gw_gui_donation_mark',
            name: 'custbody_gw_gui_donation_mark',
            join: '',
        },            
        custbody_gw_gui_format: {
            id: 'custbody_gw_gui_format',
            sourceField: 'custbody_gw_gui_format',
            outputField: 'custbody_gw_gui_format',
            name: 'custbody_gw_gui_format',
            join: '',
        },            
        custbody_gw_gui_class: {
            id: 'custbody_gw_gui_class',
            sourceField: 'custbody_gw_gui_class',
            outputField: 'custbody_gw_gui_class',
            name: 'custbody_gw_gui_class',
            join: '',
        },
        custbody_gw_gui_department: {
            id: 'custbody_gw_gui_department',
            sourceField: 'custbody_gw_gui_department',
            outputField: 'custbody_gw_gui_department',
            name: 'custbody_gw_gui_department',
            join: '',
        },        
        custbody_gw_gui_donation_code: {
            id: 'custbody_gw_gui_donation_code',
            sourceField: 'custbody_gw_gui_donation_code',
            outputField: 'custbody_gw_gui_donation_code',
            name: 'custbody_gw_gui_donation_code',
            join: '',
        },
        custbody_gw_gui_main_memo: {
            id: 'custbody_gw_gui_main_memo',
            sourceField: 'custbody_gw_gui_main_memo',
            outputField: 'custbody_gw_gui_main_memo',
            name: 'custbody_gw_gui_main_memo',
            join: '',
        },
        custbody_gw_gui_not_upload: {
            id: 'custbody_gw_gui_not_upload',
            sourceField: 'custbody_gw_gui_not_upload',
            outputField: 'custbody_gw_gui_not_upload',
            name: 'custbody_gw_gui_not_upload',
            join: '',
        },
        custbody_gw_evidence_issue_status: {
            id: 'custbody_gw_evidence_issue_status',
            sourceField: 'custbody_gw_evidence_issue_status',
            outputField: 'custbody_gw_evidence_issue_status',
            name: 'custbody_gw_evidence_issue_status',
            join: '',
        },
        custbody_gw_gui_apply_period: {
            id: 'custbody_gw_gui_apply_period',
            sourceField: 'custbody_gw_gui_apply_period',
            outputField: 'custbody_gw_gui_apply_period',
            name: 'custbody_gw_gui_apply_period',
            join: '',
        },
        custbody_gw_gui_date: {
            id: 'custbody_gw_gui_date',
            sourceField: 'custbody_gw_gui_date',
            outputField: 'custbody_gw_gui_date',
            name: 'custbody_gw_gui_date',
            join: '',
        },
        custcol_gw_item_memo: {
            id: 'custcol_gw_item_memo',
            sourceField: 'custcol_gw_item_memo',
            outputField: 'custcol_gw_item_memo',
            name: 'custcol_gw_item_memo',
            join: '',
        },
        'item.displayname': {
            id: 'item.displayname',
            sourceField: 'item.displayname',
            outputField: 'item.displayname',
            name: 'displayname',
            join: 'item',
        },
        'customer.email': {
            id: 'customer.email',
            sourceField: 'customer.email',
            outputField: 'customer.email',
            name: 'email',
            join: 'customer',
        },
        'taxItem.rate': {
            id: 'taxItem.rate',
            sourceField: 'taxItem.rate',
            outputField: 'taxRate',
            name: 'rate',
            join: 'taxItem',
        },
        'taxItem.itemid': {
            id: 'taxItem.itemid',
            sourceField: 'taxItem.itemid',
            outputField: 'taxItem.itemid',
            name: 'itemid',
            join: 'taxItem',
        },
		'taxItem.internalid': {
            id: 'taxItem.internalid',
            sourceField: 'taxItem.internalid',
            outputField: 'taxCode',
            name: 'internalid',
            join: 'taxItem',
        },
        'unitabbreviation': {
            id: 'unitabbreviation',
            sourceField: 'unitabbreviation',
            outputField: 'unitabbreviation',
            name: 'unitabbreviation',
            join: '',
        },
        'createdby': {
            id: 'createdby',
            sourceField: 'createdby',
            outputField: 'createdby',
            name: 'createdby',
            join: '',
        },
        currency: {
            id: 'currency',
            sourceField: 'currency',
            outputField: 'currency',
            name: 'currency',
            join: '',
        }, 
        'Currency.exchangerate': {
            id: 'Currency.exchangerate',
            sourceField: 'Currency.exchangerate',
            outputField: 'Currency.exchangerate',
            name: 'exchangerate',
            join: 'Currency',
        },
        'subsidiary': {
            id: 'subsidiary',
            sourceField: 'subsidiary',
            outputField: 'subsidiary',
            name: 'subsidiary',
            join: '',
        }
        // 'test': {
        //     id: '',
        //     sourceField: '',
        //     outputField: 'testProperty',
        //     name: '',
        //     join: '',
        // }
    }

    var fieldInputMapping = ramda.reduce(
        function (result, fieldId) {
            var fieldObj = fieldConfig[fieldId]
            if (fieldObj.sourceField) {
                result[fieldId] = fieldObj.sourceField
            }
            return result
        },
        {},
        Object.keys(fieldConfig)
    )

    var fieldOutputMapping = ramda.reduce(
        function (result, fieldId) {
            var fieldObj = fieldConfig[fieldId]
            if (fieldObj.outputField) {
                result[fieldObj.id] = fieldObj.outputField
            }
            return result
        },
        {},
        Object.keys(fieldConfig)
    )

    exports.fields = fieldConfig
    exports.allFieldIds = Object.keys(fieldConfig).map(function (key) {
        return key
    })
    exports.allSearchColumnFields = Object.keys(fieldConfig).reduce(function(filtered, key) {
        if (fieldConfig[key].id) filtered.push(fieldConfig[key].id)
        return filtered
    }, [])

    exports.fieldOutputMapping = fieldOutputMapping
    exports.fieldInputMapping = fieldInputMapping
    exports.recordId = recordId
    return exports
})
