/**
 *
 * @copyright 2023 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['../../library/ramda.min'], function (ramda) {

    var exports = {}
    var recordId = 'transaction'
    var fieldConfig = {
        custbody_gw_allowance_num_end: {
            id: 'custbody_gw_allowance_num_end',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_allowance_num_start: {
            id: 'custbody_gw_allowance_num_start',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_evidence_issue_status: {
            id: 'custbody_gw_evidence_issue_status',
            fieldType: 'LIST',
            defaultValue: '',
            needToSetDefaultValue: true,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_apply_period: {
            id: 'custbody_gw_gui_apply_period',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_carrier_id_1: {
            id: 'custbody_gw_gui_carrier_id_1',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_carrier_id_2: {
            id: 'custbody_gw_gui_carrier_id_2',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_carrier_type: {
            id: 'custbody_gw_gui_carrier_type',
            fieldType: 'LIST',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_class: {
            id: 'custbody_gw_gui_class',
            fieldType: 'LIST',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_date: {
            id: 'custbody_gw_gui_date',
            fieldType: 'DATE',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_department: {
            id: 'custbody_gw_gui_department',
            fieldType: 'LIST',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_donation_code: {
            id: 'custbody_gw_gui_donation_code',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_donation_mark: {
            id: 'custbody_gw_gui_donation_mark',
            fieldType: 'CHECKBOX',
            defaultValue: false,
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_format: {
            id: 'custbody_gw_gui_format',
            fieldType: 'LIST',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_main_memo: {
            id: 'custbody_gw_gui_main_memo',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_not_upload: {
            id: 'custbody_gw_gui_not_upload',
            fieldType: 'CHECKBOX',
            defaultValue: false,
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_num_end: {
            id: 'custbody_gw_gui_num_end',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: false
        },
        custbody_gw_gui_num_start: {
            id: 'custbody_gw_gui_num_start',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: false
        },
        custbody_gw_gui_sales_amt: {
            id: 'custbody_gw_gui_sales_amt',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_sales_amt_tax_exempt: {
            id: 'custbody_gw_gui_sales_amt_tax_exempt',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_sales_amt_tax_zero: {
            id: 'custbody_gw_gui_sales_amt_tax_zero',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_tax_amt: {
            id: 'custbody_gw_gui_tax_amt',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_tax_file_date: {
            id: 'custbody_gw_gui_tax_file_date',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_tax_rate: {
            id: 'custbody_gw_gui_tax_rate',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_tax_type: {
            id: 'custbody_gw_gui_tax_type',
            fieldType: 'LIST',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_total_amt: {
            id: 'custbody_gw_gui_total_amt',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_is_issue_egui: {
            id: 'custbody_gw_is_issue_egui',
            fieldType: 'CHECKBOX',
            defaultValue: true,
            needToSetDefaultValue: true,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_lock_transaction: {
            id: 'custbody_gw_lock_transaction',
            fieldType: 'CHECKBOX',
            defaultValue: false,
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_seller_tax_id: {
            id: 'custbody_gw_seller_tax_id',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourceField: false,
            needToClearForCreditMemo: true
        },
        custbody_gw_gui_address: {
            id: 'custbody_gw_gui_address',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourcedField: true,
            sourceRecord: 'customer',
            sourceFieldId: 'custentity_gw_gui_address',
            needToClearForCreditMemo: false
        },
        custbody_gw_gui_title: {
            id: 'custbody_gw_gui_title',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourcedField: true,
            sourceRecord: 'customer',
            sourceFieldId: 'custentity_gw_gui_title',
            needToClearForCreditMemo: false
        },
        custbody_gw_tax_id_number: {
            id: 'custbody_gw_tax_id_number',
            fieldType: 'TEXT',
            defaultValue: '',
            needToSetDefaultValue: false,
            sourcedField: true,
            sourceRecord: 'customer',
            sourceFieldId: 'custentity_gw_tax_id_number',
            needToClearForCreditMemo: false
        }
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
    exports.defaultValueFields = Object.keys(fieldConfig).filter(function (key) {
        return fieldConfig[key].needToSetDefaultValue
    })
    exports.nonDefaultValueFields = Object.keys(fieldConfig).reduce(function(filtered, key) {
        if (!fieldConfig[key].needToSetDefaultValue) filtered.push(fieldConfig[key].id)
        return filtered
    }, [])
    exports.sourcedFields = Object.keys(fieldConfig).reduce(function(filtered, key) {
        if (fieldConfig[key].sourcedField) filtered.push(fieldConfig[key].id)
        return filtered
    }, [])
    exports.allSearchColumnFields = Object.keys(fieldConfig).reduce(function(filtered, key) {
        if (fieldConfig[key].id) filtered.push(fieldConfig[key].id)
        return filtered
    }, [])

    exports.fieldOutputMapping = fieldOutputMapping
    exports.fieldInputMapping = fieldInputMapping
    exports.recordId = recordId
    return exports
})