/**
 *
 * @copyright 2023 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 *
 * @NScriptType MapReduceScript
 *
 */

define([
    './services/rich/gw_lib_sync_voucher'
], (
    gwLibSyncVoucher
) => {

    let exports = {};

    const getInputData = (inputContext) => {
        // get pending update status data
        log.debug({
            title: '[getInputData stage]',
            details: 'start...'
        })
        return gwLibSyncVoucher.getPendingUpdateStatusData()
    }

    const map = (mapContext) => {
        try {
            const result = JSON.parse(mapContext.value);
            log.debug('[map stage] - result', result);
            mapContext.write({
                key: result.id,
                value: result.values
            });
        } catch (e) {
            log.error('[map stage] - error', e);
        }
    }

    const reduce = (reduceContext) => {
        log.debug('[reduce stage] - reduceContext', reduceContext);
        let searchResults = reduceContext.values.map((value) => {
            return JSON.parse(value);
        });
        log.debug({title: '[reduce stage] - searchResults', details: searchResults});
        try {
            //TODO - proceed main process
            log.debug({title: 'proceed main process - searchResults', details: searchResults})
            gwLibSyncVoucher.downloadVoucherStatus(searchResults[0]);
        } catch (e) {
            // eslint-disable-next-line suitescript/log-args
            log.error({title: '[reduce stage] - error', details: e});
        }
    }

    const summarize = (summaryContext) => {

    }

    exports.getInputData = getInputData;
    exports.map = map;
    exports.reduce = reduce;
    exports.summarize = summarize;
    return exports;
});
