/**
 *
 * @copyright 2024 GateWeb
 * @author Chesley Lo
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    'N/record',
    'N/search',
    'N/runtime',
    './gw_common_invoice_utility'
], (
    record,
    search,
    runtime,
    invoiceUtility
) => {

    let exports = {};

    exports.getParamsByTransactionType = (context) => {
        const transactionTypeMapping = {
            customerdeposit: {
                buttonName: '開立發票',
                scriptPath: './gw_custom_deposit_open_egui_event.js',
                functionName: 'onButtonClick()'
            },
            cashsale: {
                buttonName: '開立發票',
                scriptPath: './gw_cash_sale_open_egui_event.js',
                functionName: 'onButtonClick()'
            },
            invoice: {
                buttonName: '開立發票',
                scriptPath: './gw_invoice_open_voucher_event.js',
                functionName: 'onButtonClickForEGUI()'
            },
            creditmemo: {
                buttonName: '開立折讓(電子發票)',
                scriptPath: './gw_invoice_open_voucher_event.js',
                functionName: 'onButtonClickForAllowance()'
            }
        }

        return transactionTypeMapping[context.newRecord.type]
    }

    exports.isNeedToDisplayCreateVoucherButton = (context) => {
        let flag = false
        const recordObject = context.newRecord

        const singleIssueEvidenceStatusValue = invoiceUtility.getManualOpenID()
        const isLocked = recordObject.getValue({fieldId: 'custbody_gw_lock_transaction'})
        const isIssueEGUI = recordObject.getValue({fieldId: 'custbody_gw_is_issue_egui'})
        const issueEvidenceStatusId = recordObject.getValue({fieldId: 'custbody_gw_evidence_issue_status'})
        let issueEvidenceStatusText = ''
        if(issueEvidenceStatusId) {
            const lookupResultObject = search.lookupFields({
                type: 'customrecord_gw_evidence_status',
                id: issueEvidenceStatusId,
                columns: ['custrecord_gw_evidence_status_value']
            })
            issueEvidenceStatusText = lookupResultObject['custrecord_gw_evidence_status_value']
        }

        log.debug({
            title: 'isNeedToDisplayCreateVoucherButton - params info',
            details: {
                singleIssueEvidenceStatusValue,
                isLocked,
                isIssueEGUI,
                issueEvidenceStatusId,
                issueEvidenceStatusText
            }
        })

        if(singleIssueEvidenceStatusValue === issueEvidenceStatusText && isIssueEGUI && !isLocked) {
            // TODO check current user role
            const currentUserObject = runtime.getCurrentUser()
            const companyArray = invoiceUtility.getBusinessEntitByUserId(currentUserObject)
            log.debug({
                title: 'isNeedToDisplayCreateVoucherButton - companyArray',
                details: companyArray
            })
            if(companyArray.length > 0)  flag = true
        }

        if(context.newRecord.type === 'invoice' && getTriangularTrade(recordObject)) {
            flag = false
        }

        log.debug({title: 'isNeedToDisplayCreateVoucherButton - flag', details: flag})

        return flag
    }

    function getTriangularTrade(recordObject) {
        let triangularTrade = false
        const numLines = recordObject.getLineCount({sublistId: 'item'})
        log.debug({
            title: 'getTriangularTrade - numLines',
            details: numLines
        })
        const sublistId = 'item'
        for (let line = 0; line < numLines; line ++) {
            const salesTypeId = recordObject.getSublistValue({
                sublistId,
                line,
                fieldId: 'cseg_ntt_sales_type'
            })
            var salesTypeText = recordObject.getSublistText({
                sublistId,
                line,
                fieldId: 'cseg_ntt_sales_type',

            });
            if (salesTypeText === '三角貿易') {
                triangularTrade = true
            }
            log.debug({
                title: 'getTriangularTrade - params',
                details: {
                    salesTypeId,
                    salesTypeText,
                    triangularTrade
                }
            })
        }
        return triangularTrade
    }

    return exports
});
