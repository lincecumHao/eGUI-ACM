define([
    'N/runtime'
], (
    runtime
) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   * @NScriptType UserEventScript
   */
  var exports = {}
  const DO_NOT_ALLOW_VIA_USER_INTERFACE_ERROR_MESSAGE = 'Do not allow to create/edit 進項發票或憑證 via UserInterface, please go back to bill record to enter 進項發票或憑證'

  function isViaUserInterface(context) {
    return (context.type === context.UserEventType.CREATE
        || context.type === context.UserEventType.EDIT
        || context.type === context.UserEventType.COPY)
        && runtime.executionContext === runtime.ContextType.USER_INTERFACE
  }

  /**
   * beforeLoad event handler; executes whenever a read operation occurs on a record, and prior
   * to returning the record or page.
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {Record} context.newRecord - The new record being loaded
   * @param {UserEventType} context.type - The action type that triggered this event
   * @param {Form} context.form - The current UI form
   */
  function beforeLoad(context) {
    // TODO
    log.debug({
      title: 'beforeLoad',
      details: {
        contextType: context.type,
        runtimeExecutionContext: runtime.executionContext
      }
    })

    if(isViaUserInterface(context)) {
      throw DO_NOT_ALLOW_VIA_USER_INTERFACE_ERROR_MESSAGE
    }
  }

  /**
   * beforeSubmit event handler; executes prior to any write operation on the record.
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {Record} context.newRecord - The new record being submitted
   * @param {Record} context.oldRecord - The old record before it was modified
   * @param {UserEventType} context.type - The action type that triggered this event
   */
  function beforeSubmit(context) {
    // TODO

    log.debug({ title: 'beforeSubmit', details: context.type })
  }

  /**
   * afterSubmit event handler; executes immediately after a write operation on a record.
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {Record} context.newRecord - The new record being submitted
   * @param {Record} context.oldRecord - The old record before it was modified
   * @param {UserEventType} context.type - The action type that triggered this event
   */
  function afterSubmit(context) {
    // TODO

    log.debug({ title: 'afterSubmit', details: context.type })
  }

  exports.beforeLoad = beforeLoad
  exports.beforeSubmit = beforeSubmit
  exports.afterSubmit = afterSubmit
  return exports
})
