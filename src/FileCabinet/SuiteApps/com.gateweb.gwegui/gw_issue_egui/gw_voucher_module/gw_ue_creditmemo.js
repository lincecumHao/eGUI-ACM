/**
 *
 * @copyright 2023 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 *
 * @NScriptType UserEventScript
 */
define(['../../gw_library/gw_lib_transaction_util'], (gwLibTransactionUtil) => {

    let exports = {};

    /**
     * Defines the function definition that is executed before record is loaded.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @param {Form} scriptContext.form - Current form
     * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
     * @since 2015.2
     */
    const beforeLoad = (scriptContext) => {
        try {
            log.debug({
                title: 'beforeLoad - scriptContext.type',
                details: scriptContext.type
            })
            if(gwLibTransactionUtil.isNeedToClearCreditMemoEGUIData(scriptContext)) {
                gwLibTransactionUtil.clearValueForCreditMemo(scriptContext)
                // gwLibTransactionUtil.setSourceFieldValue(scriptContext)
            }
        } catch (e) {
            log.error({
                title: 'beforeLoad - e',
                details: e
            })
        }
    }

    /**
     * Defines the function definition that is executed before record is submitted.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @since 2015.2
     */
    const beforeSubmit = (scriptContext) => {
        try {
            log.debug({
                title: 'beforeSubmit - scriptContext.type',
                details: scriptContext.type
            })
            if(gwLibTransactionUtil.isNeedToSetDefaultValueForEGUIData(scriptContext)) {
                gwLibTransactionUtil.setDefaultValueForEGUI(scriptContext)
            }
        } catch (e) {
            log.error({
                title: 'beforeSubmit - e',
                details: e
            })
        }
    }

    /**
     * Defines the function definition that is executed after record is submitted.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @since 2015.2
     */
    const afterSubmit = (scriptContext) => {

    }

    exports.beforeLoad = beforeLoad;
    exports.beforeSubmit = beforeSubmit;
    exports.afterSubmit = afterSubmit;
    return exports;
});
