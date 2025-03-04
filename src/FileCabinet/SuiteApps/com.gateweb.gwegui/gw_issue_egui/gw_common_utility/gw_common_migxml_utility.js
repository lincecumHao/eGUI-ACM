/**
 * MigXml Tool
 * gwMigXmlUtility.js
 * @NApiVersion 2.x
 */
define([
  'N/xml',
  'N/format',
  'N/search',
  'N/record',
  './gw_common_configure' 
], function (xml, format, search, record, gwconfigure) {
  var _gw_voucher_main_search_id = 'customsearch_gw_voucher_main_search'
  var _gw_voucher_properties = 'customrecord_gw_voucher_properties'

  var _NETSUITE_MODEL = 'NETSUITE'
  var _GATEWEB_MODEL = 'GATEWEB'

  var _numericToFixed = '4' //小數4位
  //設定Main及Amount的值
  function setXmlMainAndAmountValue(
    _xmlDocument,
    selectedpath,
    parentNodeName,
    nodeName,
    nodeValue
  ) {
    try {
      var _migInvoiceNode = xml.XPath.select({
        node: _xmlDocument,
        xpath: selectedpath,
      })

      for (var i = 0; i < _migInvoiceNode.length; i++) {
        var _childNodes = _migInvoiceNode[i].childNodes

        for (var j = 0; j < _childNodes.length; j++) {
          var _childNode = _childNodes[j]
          var _childNodeName = _childNodes[j].nodeName
          //處理Main及Amount
          if (_childNodeName !== 'Details') {
            //處理Main及Amount
            converNode(_childNode, parentNodeName, nodeName, nodeValue, false)
          }
        }
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }
  }

  //設定eGUI Detail Item的值
  function setEGUIXmlDetailsItemValue(
    _xmlDocument,
    isFirst,
    description,
    quantity,
    unit,
    unitPrice,
    amount,
    sequenceNumber,
    itemremark
  ) {
    try {
      var _migInvoiceNode = xml.XPath.select({
        node: _xmlDocument,
        xpath: 'Invoice',
      })

      for (var i = 0; i < _migInvoiceNode.length; i++) {
        var _childNodes = _migInvoiceNode[i].childNodes

        for (var j = 0; j < _childNodes.length; j++) {
          var _childNode = _childNodes[j]
          var _childNodeName = _childNodes[j].nodeName
          //處理Details
          if (_childNodeName === 'Details') {
            if (isFirst === true) {
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Description',
                description,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Quantity',
                quantity,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Unit',
                unit,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'UnitPrice',
                unitPrice,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Amount',
                amount,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'SequenceNumber',
                sequenceNumber,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Remark',
                itemremark,
                false
              )
            } else {
              var _productItemNode = _childNodes[j].lastChild
              //複製筆數
              var _copiedNode = _productItemNode.cloneNode({
                deep: true,
              })
              converNode(
                _copiedNode,
                'Description',
                'Description',
                description,
                true
              )
              converNode(_copiedNode, 'Quantity', 'Quantity', quantity, true)
              converNode(_copiedNode, 'Unit', 'Unit', unit, true)
              converNode(_copiedNode, 'UnitPrice', 'UnitPrice', unitPrice, true)
              converNode(_copiedNode, 'Amount', 'Amount', amount, true)
              converNode(
                _copiedNode,
                'SequenceNumber',
                'SequenceNumber',
                sequenceNumber,
                true
              )
              converNode(_copiedNode, 'Remark', 'Remark', itemremark, true)

              _childNodes[j].appendChild(_copiedNode)
            }
          }
        }
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }
  }

  //設定Allowance Detail Item的值
  function setAllowanceXmlDetailsItemValue(
    _xmlDocument,
    xmlpath,
    isFirst,
    description,
    quantity,
    unit,
    unitPrice,
    amount,
    sequenceNumber,
    itemremark,
    originalInvoiceNumber,
    originalInvoiceDate,
    taxType,
    taxAmount
  ) {
    try {
      var _migInvoiceNode = xml.XPath.select({
        node: _xmlDocument,
        xpath: xmlpath,
      })

      for (var i = 0; i < _migInvoiceNode.length; i++) {
        var _childNodes = _migInvoiceNode[i].childNodes

        for (var j = 0; j < _childNodes.length; j++) {
          var _childNode = _childNodes[j]
          var _childNodeName = _childNodes[j].nodeName
          //處理Details
          if (_childNodeName === 'Details') {
            if (isFirst === true) {
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'OriginalInvoiceNumber',
                originalInvoiceNumber,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'OriginalInvoiceDate',
                originalInvoiceDate,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'OriginalSequenceNumber',
                sequenceNumber,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'OriginalDescription',
                description,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Quantity',
                quantity,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Unit',
                unit,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'UnitPrice',
                unitPrice,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Amount',
                amount,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'AllowanceSequenceNumber',
                sequenceNumber,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'TaxType',
                taxType,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Tax',
                taxAmount,
                false
              )

              //converNode(_childNodes[j].firstChild, 'ProductItem', 'Remark', itemremark, false);
            } else {
              var _productItemNode = _childNodes[j].lastChild
              //複製筆數
              var _copiedNode = _productItemNode.cloneNode({
                deep: true,
              })
              converNode(
                _copiedNode,
                'OriginalInvoiceNumber',
                'OriginalInvoiceNumber',
                originalInvoiceNumber,
                true
              )
              converNode(
                _copiedNode,
                'OriginalInvoiceDate',
                'OriginalInvoiceDate',
                originalInvoiceDate,
                true
              )
              converNode(
                _copiedNode,
                'OriginalInvoiceDate',
                'OriginalSequenceNumber',
                sequenceNumber,
                true
              )
              converNode(
                _copiedNode,
                'OriginalDescription',
                'OriginalDescription',
                description,
                true
              )
              converNode(_copiedNode, 'Quantity', 'Quantity', quantity, true)
              converNode(_copiedNode, 'Unit', 'Unit', unit, true)
              converNode(_copiedNode, 'UnitPrice', 'UnitPrice', unitPrice, true)
              converNode(_copiedNode, 'Amount', 'Amount', amount, true)
              converNode(
                _copiedNode,
                'AllowanceSequenceNumber',
                'AllowanceSequenceNumber',
                sequenceNumber,
                true
              )
              converNode(_copiedNode, 'ProductItem', 'TaxType', taxType, true)
              converNode(_copiedNode, 'ProductItem', 'Tax', taxAmount, true)
              //converNode(_copiedNode, 'Remark', 'Remark', itemremark, true);

              _childNodes[j].appendChild(_copiedNode)
            }
          }
        }
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }
  }

  //common function
  function converNode(
    node,
    parentNodeName,
    nodeName,
    nodeValue,
    isAccessDetail
  ) {
    try {
      var _hasChildren = node.hasChildNodes()
      if (_hasChildren) {
        var _childNodes = node.childNodes
        for (var i = 0; i < _childNodes.length; i++) {
          var _childNode = _childNodes[i]
          converNode(
            _childNode,
            parentNodeName,
            nodeName,
            nodeValue,
            isAccessDetail
          )
        }
      } else {
        var _nodeName = node.nodeName
        var _nodeText = node.textContent

        var _parentNodeName = node.parentNode.nodeName
        if (isAccessDetail === true) {
          if (_parentNodeName === nodeName) {
            node.textContent = nodeValue
          }
        } else {
          if (_parentNodeName === parentNodeName && _nodeName === nodeName) {
            node.textContent = nodeValue
          }
        }
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }
  }

  function convertToFloat(str) {
    if (typeof str === 'undefined' || str == null || str.length == 0) {
      str = '0'
    } else {
      if (typeof str === 'string') str = str.trim()
      else str.toString()
    }
    return parseFloat(str)
  }

  function convertToInt(str) {
    if (typeof str === 'undefined' || str == null || str.length == 0) {
      str = '0'
    } else {
      if (typeof str === 'string') str = str.trim()
      else str.toString()
    }
    return parseInt(str)
  }

  function getMigType(applyType, voucherType, migType) {
    var _id
    try {
      var _file_path = ''
      if (applyType == 'CANCEL') {
        //作廢
        if (voucherType === 'EGUI') {
          if (migType == 'B2BE') {
            _id = 'A0201'
          } else if (migType == 'B2BS') {
            //_id = 'A0401';
            _id = 'C0501'
          } else if (migType == 'B2C') {
            _id = 'C0501'
          }
        } else if (voucherType === 'ALLOWANCE') {
          if (migType == 'B2BE') {
            //TODO
            _id = 'B0201'
          } else if (migType == 'B2BS') {
            //_id = 'B0401';
            _id = 'D0501'
          } else if (migType == 'B2C') {
            _id = 'D0501'
          }
        }
      } else {
        //開立
        if (voucherType === 'EGUI') {
          if (migType == 'B2BE') {
            _id = 'A0101'
          } else if (migType == 'B2BS') {
            //_id = 'A0401';
            _id = 'C0401'
          } else if (migType == 'B2C') {
            _id = 'C0401'
          }
        } else if (voucherType === 'ALLOWANCE') {
          if (migType == 'B2BE') {
            //TODO
            _id = 'B0101'
          } else if (migType == 'B2BS') {
            //_id = 'B0401';
            _id = 'D0401'
          } else if (migType == 'B2C') {
            _id = 'D0401'
          }
        }
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }
    return _id
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //處理發票資料-START
  function getVoucherToDoList(
    voucher_type,
    voucher_list_id,
    b2bs_xml,
    b2be_xml,
    b2c_xml,
    genxml_toftp_result,
    genxml_toftp_message
  ) {
    var _jsonObjAry = []

    try {
      var _idAry = voucher_list_id.split(',')
      //1. Load XML
      //var b2bs_xml = loadInvoiceMigXml(voucher_type, 'B2BS');
      //var b2be_xml = loadInvoiceMigXml(voucher_type, 'B2BE');
      //var b2c_xml  = loadInvoiceMigXml(voucher_type, 'B2C');

      var _xmlDocument
      var _mySearch = search.load({
        id: _gw_voucher_main_search_id,
      })
      var _filterArray = []
      _filterArray.push(['internalId', search.Operator.ANYOF, _idAry])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_type',
        search.Operator.IS,
        voucher_type,
      ])
      //NE-326 只下載 33及35格式
      _filterArray.push('and');       
      if(voucher_type=='ALLOWANCE'){
    	 _filterArray.push(['custrecord_gw_voucher_format_code',search.Operator.IS, '33']);
      }else{
    	 _filterArray.push(['custrecord_gw_voucher_format_code',search.Operator.IS, '35']);
      } 
      //_filterArray.push('and');
      //_filterArray.push(['custrecord_gw_need_upload_egui_mig',search.Operator.ISNOT, 'NONE']);
      _mySearch.filterExpression = _filterArray

      var _indexId = ''
      var _isFirst = true
      var _pre_mig_type = ''
      var _pre_apply_id = 0
      var _pre_voucher_number = ''
      var _pre_buyer = ''
      var _pre_tax_type = ''
      var _pre_is_printed = false
      var _pre_is_printed_pdf = false
      var _pre_is_printed_paper = false
      var _pre_voucher_extra_memo = ''
      //20201002 walter modify 判斷是否上傳(NONE)
      var _pre_need_upload_egui_mig = 'ALL'

      var _pre_voucher_status = ''
      var _pre_upload_status = ''
      var _select_path = 'Invoice'
      if (voucher_type !== 'EGUI') _select_path = 'Allowance'

      _mySearch.run().each(function (result) {
        var _result = JSON.parse(JSON.stringify(result))
        log.debug('JSON.stringify(result)', JSON.stringify(result))
        //1.Main Information
        var _id = _result.id //948
        var _mig_type = _result.values.custrecord_gw_mig_type //B2BS, B2BE, B2C
        var _voucher_number = _result.values.custrecord_gw_voucher_number
        var _voucher_date = _result.values.custrecord_gw_voucher_date
        var _voucher_time = _result.values.custrecord_gw_voucher_time
        var _voucher_yearmonth = _result.values.custrecord_gw_voucher_yearmonth
        var _seller = _result.values.custrecord_gw_seller
        var _seller_name = _result.values.custrecord_gw_seller_name
        var _seller_address = _result.values.custrecord_gw_seller_address
        var _buyer = _result.values.custrecord_gw_buyer
        var _buyer_name = _result.values.custrecord_gw_buyer_name
        var _buyer_address = _result.values.custrecord_gw_buyer_address
        var _buyer_dept_code = _result.values.custrecord_gw_buyer_dept_code
        var _invoice_type = _result.values.custrecord_gw_invoice_type
        var _carrier_type = _result.values.custrecord_gw_carrier_type
        var _carrierid1 = _result.values.custrecord_gw_carrierid1
        var _carrierid2 = _result.values.custrecord_gw_carrierid2
        var _npoban = _result.values.custrecord_gw_npoban
        var _clearance_mark = _result.values.custrecord_gw_clearance_mark
        var _main_remark = _result.values.custrecord_gw_main_remark
        var _random_number = _result.values.custrecord_gw_random_number
        var _need_upload_egui_mig =
          _result.values.custrecord_gw_need_upload_egui_mig
        var _sales_amount = _result.values.custrecord_gw_sales_amount
        var _free_sales_amount = _result.values.custrecord_gw_free_sales_amount
        var _zero_sales_amount = _result.values.custrecord_gw_zero_sales_amount
        var _tax_amount = _result.values.custrecord_gw_tax_amount
        var _tax_rate = _result.values.custrecord_gw_tax_rate //0.05
        var _tax_type = _result.values.custrecord_gw_tax_type
        var _total_amount = _result.values.custrecord_gw_total_amount
        var _print_mark = _result.values.custrecord_gw_print_mark
        var _voucher_extra_memo =
          _result.values.custrecord_gw_voucher_extra_memo

        //處理 Print 紀錄
        var _is_printed = false //_mig_type
        var _is_printed_paper = _result.values.custrecord_gw_is_printed_paper
        var _is_printed_pdf = _result.values.custrecord_gw_is_printed_pdf
        if (_is_printed_paper == true || _is_printed_pdf == true)
          _is_printed = true

        //發票狀態VOUCHER_XXXX, CANCEL_XXXX
        var _voucher_status = _result.values.custrecord_gw_voucher_status
        // A==>P==> C or E or G
        var _upload_status = _result.values.custrecord_gw_voucher_upload_status

        //四捨五入
        if (convertToFloat(_tax_rate) == 0) {
          //0.00
          _tax_rate = '0'
        }
        //判斷B2C , C0401的相關欄位計算
        if (
          voucher_type === 'EGUI' &&
          _mig_type !== 'B2E' &&
          _buyer == '0000000000'
        ) {
          //Invoice & B2C & C0401
          //B2C & C0401 的發票，這裡要含稅金
          _sales_amount = Math.round(
            convertToFloat(_sales_amount) + convertToFloat(_tax_amount)
          ).toString()
          //_sales_amount= (Math.round(convertToFloat(_sales_amount))).toString();
          _tax_amount = '0' //B2C的發票，稅金為0
        } else if (voucher_type !== 'EGUI') {
          //折讓單要放未稅金額
          _sales_amount = Math.round(convertToFloat(_sales_amount)).toString()
          _total_amount = Math.round(
            convertToFloat(_total_amount) - convertToFloat(_tax_amount)
          ).toString()
        } else {
          _sales_amount = Math.round(convertToFloat(_sales_amount)).toString()
        }
        _free_sales_amount = Math.round(
          convertToFloat(_free_sales_amount)
        ).toString()
        _zero_sales_amount = Math.round(
          convertToFloat(_zero_sales_amount)
        ).toString()
        _tax_amount = Math.round(convertToFloat(_tax_amount)).toString()
        _total_amount = Math.round(convertToFloat(_total_amount)).toString()

        if (_indexId !== _id) {
          if (_indexId !== '') {
            //處理 mig xml 檔
            var _mig_xml = xml.Parser.toString({
              document: _xmlDocument,
            })

            if (voucher_type === 'EGUI') {
              if (_pre_mig_type === 'B2BS') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
                )
                if (_pre_tax_type !== '2') {
                  //非零稅要拿掉
                  _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
                }
                if (_pre_buyer == '0000000000') {
                  //B2C +C0401
                  _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
                }
              } else if (_pre_mig_type === 'B2BE') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0101:3.1"'
                )
              } else if (_pre_mig_type === 'B2C') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
                )
                if (_pre_tax_type != '2') {
                  //非零稅要拿掉
                  _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
                }
                if (_pre_buyer == '0000000000') {
                  //B2C +C0401
                  _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
                }
              }
            } else {
              //ALLOWANCE
              if (_pre_mig_type === 'B2BS') {
                //_mig_xml = _mig_xml.replace('Allowance', 'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0401:3.1"');
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
                )
              } else if (_pre_mig_type === 'B2BE') {
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0101:3.1"'
                )
              } else if (_pre_mig_type === 'B2C') {
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
                )
              }
            }
            //A0101-AX123456789-123
            var _xml_mig_type = getMigType('APPLY', voucher_type, _pre_mig_type)
            var _file_name =
              _xml_mig_type + '-' + _pre_voucher_number + '-' + _pre_apply_id

            //判斷是否是開立或作廢
            var _data_type = '2' //開立
            if (_pre_voucher_status.indexOf('CANCEL') != -1) {
              //作廢
              _data_type = '3' //作廢
            }
            var _jsonObj = {
              apply_id: _pre_apply_id,
              data_type: _data_type,
              mig_type: _xml_mig_type,
              file_name: _file_name,
              is_printed: _pre_is_printed,
              is_printed_pdf: _pre_is_printed_pdf,
              is_printed_paper: _pre_is_printed_paper,
              extra_memo: _pre_voucher_extra_memo,
              need_upload_egui_mig: _pre_need_upload_egui_mig,
              mig_xml: _mig_xml,
            }
            _jsonObjAry.push(_jsonObj)
            _isFirst = true
          }

          //要記錄下一筆的migType
          if (_mig_type === 'B2BS') {
            _xmlDocument = xml.Parser.fromString({
              text: b2c_xml,
            })
          } else if (_mig_type === 'B2BE') {
            _xmlDocument = xml.Parser.fromString({
              text: b2be_xml,
            })
          } else if (_mig_type === 'B2C') {
            _xmlDocument = xml.Parser.fromString({
              text: b2c_xml,
            })
          }

          if (voucher_type === 'EGUI') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceNumber',
              _voucher_number
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceDate',
              _voucher_date
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceTime',
              _voucher_time
            )
          } else {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceNumber',
              _voucher_number
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceDate',
              _voucher_date
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceType',
              '2'
            )
          }
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Identifier',
            _seller
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Name',
            _seller_name
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Address',
            _seller_address
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Identifier',
            _buyer
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Name',
            _buyer_name
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Address',
            _buyer_address
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'InvoiceType',
            _invoice_type
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'RandomNumber',
            _random_number
          )

          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'MainRemark',
            _main_remark
          )
          if (voucher_type === 'EGUI' && _tax_type == '2') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CustomsClearanceMark',
              _clearance_mark
            )
          }
          if (voucher_type === 'EGUI' && _buyer != '0000000000') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'RelateNumber',
              _id
            )
          }
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'PrintMark',
            _print_mark
          )

          if (_mig_type === 'B2C') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierType',
              _carrier_type
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierId1',
              _carrierid1
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierId2',
              _carrierid2
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'NPOBAN',
              _npoban
            )
          }
          //DonateMark
          var _donateMark = '0'
		  if (_npoban != '') _donateMark= '1'
		   
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'DonateMark',
            _donateMark
          ) 
            
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'SalesAmount',
            _sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'FreeTaxSalesAmount',
            _free_sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'ZeroTaxSalesAmount',
            _zero_sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxAmount',
            _tax_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxRate',
            _tax_rate
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxType',
            _tax_type
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TotalAmount',
            _total_amount
          )

          _indexId = _id
        }

        //Item Details
        var _item_description =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_description'
          ]
        var _unit_price =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_unit_price'
          ]
        var _item_quantity =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_quantity'
          ]
        //20210322 walter modify
        //var _original_item_quantity = _item_quantity;
        var _dtl_item_tax_code =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_dtl_item_tax_code'
          ]
        var _dtl_item_tax_rate =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_dtl_item_tax_rate'
          ] //5
        _dtl_item_tax_rate.replace('%', '')
        var _item_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_amount'
          ]
        var _item_seq =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_seq'
          ]
        var _item_remark =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_remark'
          ]
        var _item_unit =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_unit'
          ]
        var _original_gui_number =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_number'
          ]
        var _original_gui_date =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_date'
          ]
        var _original_gui_yearmonth =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_yearmonth'
          ]
        /**
        var _item_tax_type = gwconfigure.getGwTaxTypeFromNSTaxCode(
          _dtl_item_tax_code
        )
        */
        var _item_tax_type = getTaxTypeByTaxCode(_dtl_item_tax_code) 
         
        var _taxAmount = Math.round(
          (convertToFloat(_dtl_item_tax_rate) * convertToFloat(_item_amount)) /
            100
        ).toString()

        //四捨五入
        //_unit_price        = (Math.round(convertToFloat(_unit_price))).toString();
        //20201102 walter modify 取消四捨五入
        //_unit_price        = ((convertToFloat(_unit_price)).toFixed(_numericToFixed)).toString();
        //20210322 walter modify 數量小數點
        //_item_quantity     = (Math.round(convertToFloat(_item_quantity))).toString();
        _dtl_item_tax_rate = Math.round(
          convertToFloat(_dtl_item_tax_rate)
        ).toString()
        _item_amount = Math.round(convertToFloat(_item_amount)).toString()
        //20200916 把稅額放進來
        if (
          voucher_type === 'EGUI' &&
          _mig_type !== 'B2E' &&
          _buyer == '0000000000'
        ) {
          //Invoice & B2C & C0401
          //_item_amount = (Math.round(convertToFloat(_item_amount)+convertToFloat(_taxAmount))).toString();
          _item_amount = Math.round(
            convertToFloat(_item_quantity) *
              convertToFloat(_unit_price) *
              (1 + convertToFloat(_dtl_item_tax_rate) / 100)
          ).toString()

          //計算單價
          //var _itemUnitPriceTaxAmount = (Math.round(convertToFloat(_dtl_item_tax_rate)*convertToFloat(_unit_price)/100)).toString();
          //var _itemUnitPriceTaxAmount = ((convertToFloat(_dtl_item_tax_rate)*convertToFloat(_unit_price)/100).toFixed(_numericToFixed)).toString();
          //_unit_price = (Math.round(convertToFloat(_unit_price)+convertToFloat(_itemUnitPriceTaxAmount))).toString();
          //_unit_price = ((convertToFloat(_unit_price)+convertToFloat(_itemUnitPriceTaxAmount))).toString();
          //_unit_price = (Math.round(convertToFloat(_unit_price))).toString();
        }
        //20201102 walter modify _unit_price = _item_amount /_item_quantity
        if (convertToFloat(_item_quantity) != 0) {
          _unit_price = (
            convertToFloat(_item_amount) / convertToFloat(_item_quantity)
          )
            .toFixed(_numericToFixed)
            .toString()
        } else {
          _unit_price = '0'
        }

        if (voucher_type === 'EGUI') {
          setEGUIXmlDetailsItemValue(
            _xmlDocument,
            _isFirst,
            _item_description,
            _item_quantity,
            _item_unit,
            _unit_price,
            _item_amount,
            _item_seq,
            _item_remark
          )
        } else {
          //, originalSequenceNumber, taxType, taxAmount
          setAllowanceXmlDetailsItemValue(
            _xmlDocument,
            _select_path,
            _isFirst,
            _item_description,
            _item_quantity,
            _item_unit,
            _unit_price,
            _item_amount,
            _item_seq,
            _item_remark,
            _original_gui_number,
            _original_gui_date,
            _item_tax_type,
            _taxAmount
          )
        }

        _isFirst = false

        _pre_apply_id = _id
        _pre_mig_type = _mig_type
        _pre_is_printed = _is_printed
        _pre_is_printed_pdf = _is_printed_pdf
        _pre_is_printed_paper = _is_printed_paper
        _pre_voucher_extra_memo = _voucher_extra_memo
        _pre_need_upload_egui_mig = _need_upload_egui_mig
        _pre_buyer = _buyer
        _pre_tax_type = _tax_type
        _pre_voucher_number = _voucher_number
        _pre_voucher_status = _voucher_status
        _pre_upload_status = _upload_status

        return true
      })

      //有資料才做
      if (_pre_apply_id != 0) {
        var _mig_xml = xml.Parser.toString({
          document: _xmlDocument,
        })
        if (voucher_type === 'EGUI') {
          if (_pre_mig_type === 'B2BS') {
            //_mig_xml = _mig_xml.replace('Invoice', 'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0401:3.1"');
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
            )
            //_mig_xml = _mig_xml.replace('Invoice', 'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:GEINV:eInvoiceMessage:C0401:3.1 C0401.xsd"');
            if (_pre_tax_type !== '2') {
              //非零稅要拿掉
              _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
            }
            if (_pre_buyer == '0000000000') {
              //B2C +C0401
              _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
            }
          } else if (_pre_mig_type === 'B2BE') {
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0101:3.1"'
            )
          } else if (_pre_mig_type === 'B2C') {
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
            )
            if (_pre_tax_type !== '2') {
              //非零稅要拿掉
              _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
            }
            if (_pre_buyer == '0000000000') {
              //B2C +C0401
              _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
            }
          }
        } else {
          //ALLOWANCE
          if (_pre_mig_type === 'B2BS') {
            //_mig_xml = _mig_xml.replace('Allowance', 'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0401:3.1"');
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
            )
          } else if (_pre_mig_type === 'B2BE') {
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0101:3.1"'
            )
          } else if (_pre_mig_type === 'B2C') {
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
            )
          }
        }

        //A0101-AX123456789-123
        var _xml_mig_type = getMigType('APPLY', voucher_type, _pre_mig_type)
        var _file_name =
          _xml_mig_type + '-' + _pre_voucher_number + '-' + _pre_apply_id

        //判斷是否是開立或作廢
        var _data_type = '2' //開立
        if (_pre_voucher_status.indexOf('CANCEL') != -1) {
          //作廢
          _data_type = '3' //作廢
        }
        var _jsonObj = {
          apply_id: _pre_apply_id,
          data_type: _data_type,
          mig_type: _xml_mig_type,
          file_name: _file_name,
          is_printed: _pre_is_printed,
          is_printed_pdf: _pre_is_printed_pdf,
          is_printed_paper: _pre_is_printed_paper,
          extra_memo: _pre_voucher_extra_memo,
          need_upload_egui_mig: _pre_need_upload_egui_mig,
          mig_xml: _mig_xml,
        }
        _jsonObjAry.push(_jsonObj)
      }
    } catch (e) {
      genxml_toftp_result = 'N'
      genxml_toftp_message = e.message
      log.debug(e.name, e.message)
    }

    return _jsonObjAry
  }

  //20201110 開立模式判斷=>access_model [NETSUITE, GATEWEB]
  function getVoucherToDoList(
    access_model,
    voucher_type,
    voucher_list_id,
    b2bs_xml,
    b2be_xml,
    b2c_xml,
    genxml_toftp_result,
    genxml_toftp_message
  ) {
    var _jsonObjAry = []

    try {
      var _idAry = voucher_list_id.split(',')
      var _xmlDocument
      var _mySearch = search.load({
        id: _gw_voucher_main_search_id,
      })
      var _filterArray = []
      _filterArray.push(['internalId', search.Operator.ANYOF, _idAry])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_type',
        search.Operator.IS,
        voucher_type,
      ])
      
      

      _mySearch.filterExpression = _filterArray

      var _indexId = ''
      var _isFirst = true
      var _pre_mig_type = ''
      var _pre_apply_id = 0
      var _pre_voucher_number = ''
      var _pre_buyer = ''
      var _pre_tax_type = ''
      var _pre_is_printed = false
      var _pre_is_printed_pdf = false
      var _pre_is_printed_paper = false
      var _pre_voucher_extra_memo = ''
      //20201002 walter modify 判斷是否上傳(NONE)
      var _pre_need_upload_egui_mig = 'ALL'

      var _pre_voucher_status = ''
      var _pre_upload_status = ''
      var _select_path = 'Invoice'
      if (voucher_type !== 'EGUI') _select_path = 'Allowance'

      _mySearch.run().each(function (result) {
        var _result = JSON.parse(JSON.stringify(result))
        log.debug('JSON.stringify(result)', JSON.stringify(result))
        //1.Main Information
        var _id = _result.id //948
        var _mig_type = _result.values.custrecord_gw_mig_type //B2BS, B2BE, B2C
        var _voucher_number = _result.values.custrecord_gw_voucher_number
        var _voucher_date = _result.values.custrecord_gw_voucher_date
        var _voucher_time = _result.values.custrecord_gw_voucher_time
        var _voucher_yearmonth = _result.values.custrecord_gw_voucher_yearmonth
        var _seller = _result.values.custrecord_gw_seller
        var _seller_name = _result.values.custrecord_gw_seller_name
        var _seller_address = _result.values.custrecord_gw_seller_address
        var _buyer = _result.values.custrecord_gw_buyer
        var _buyer_name = _result.values.custrecord_gw_buyer_name
        var _buyer_address = _result.values.custrecord_gw_buyer_address
        var _buyer_dept_code = _result.values.custrecord_gw_buyer_dept_code
        var _invoice_type = _result.values.custrecord_gw_invoice_type
        var _carrier_type = _result.values.custrecord_gw_carrier_type
        var _carrierid1 = _result.values.custrecord_gw_carrierid1
        var _carrierid2 = _result.values.custrecord_gw_carrierid2
        var _npoban = _result.values.custrecord_gw_npoban
        var _clearance_mark = _result.values.custrecord_gw_clearance_mark
        var _main_remark = _result.values.custrecord_gw_main_remark
        var _random_number = _result.values.custrecord_gw_random_number
        var _need_upload_egui_mig =
          _result.values.custrecord_gw_need_upload_egui_mig
        var _tax_rate = _result.values.custrecord_gw_tax_rate //0.05
        var _tax_type = _result.values.custrecord_gw_tax_type
        var _total_amount = _result.values.custrecord_gw_total_amount
        var _print_mark = _result.values.custrecord_gw_print_mark
        var _voucher_extra_memo =
          _result.values.custrecord_gw_voucher_extra_memo
        var _upload_access_model =
          _result.values.custrecord_gw_upload_access_model

        //////////////////////////////////////////////////////////////////////////////////////
        //20201110 walter 紀錄了Netsuite原始資料內容
        //////////////////////////////////////////////////////////////////////////////////////
        var _sales_amount = _result.values.custrecord_gw_sales_amount
        var _free_sales_amount = _result.values.custrecord_gw_free_sales_amount
        var _zero_sales_amount = _result.values.custrecord_gw_zero_sales_amount

        var _tax_amount = _result.values.custrecord_gw_tax_amount
        var _total_amount = _result.values.custrecord_gw_total_amount
        //////////////////////////////////////////////////////////////////////////////////////

        //處理 Print 紀錄
        var _is_printed = false //_mig_type
        var _is_printed_paper = _result.values.custrecord_gw_is_printed_paper
        var _is_printed_pdf = _result.values.custrecord_gw_is_printed_pdf
        if (_is_printed_paper == true || _is_printed_pdf == true)
          _is_printed = true

        //發票狀態VOUCHER_XXXX, CANCEL_XXXX
        var _voucher_status = _result.values.custrecord_gw_voucher_status
        // A==>P==> C or E or G
        var _upload_status = _result.values.custrecord_gw_voucher_upload_status

        //四捨五入
        if (convertToFloat(_tax_rate) == 0) {
          //0.00
          _tax_rate = '0'
        }
        //判斷B2C , C0401的相關欄位計算
        //20201110 walter modify
        if (_upload_access_model == _GATEWEB_MODEL) {
          _tax_amount = Math.round(
            convertToFloat(_sales_amount) * 0.05
          ).toString()

          _total_amount = Math.round(
            convertToFloat(_sales_amount) +
              convertToFloat(_free_sales_amount) +
              convertToFloat(_zero_sales_amount) +
              convertToFloat(_tax_amount)
          ).toString()
        }

        if (
          voucher_type == 'EGUI' &&
          _mig_type != 'B2E' &&
          _buyer == '0000000000'
        ) {
          //C0401(0000000000) 的發票，這裡要含稅金
          _sales_amount = Math.round(
            convertToFloat(_sales_amount) + convertToFloat(_tax_amount)
          ).toString()
          _tax_amount = '0' //B2C的發票，稅金為 0
        } else if (voucher_type == 'ALLOWANCE') {
          _sales_amount = Math.round(convertToFloat(_sales_amount)).toString()
          //折讓單要放未稅金額
          _total_amount = (
            convertToFloat(_sales_amount) +
            convertToFloat(_free_sales_amount) +
            convertToFloat(_zero_sales_amount)
          ).toString()
        } else {
          //C0401(非0000000000)
          _sales_amount = Math.round(convertToFloat(_sales_amount)).toString()
        }

        _free_sales_amount = Math.round(
          convertToFloat(_free_sales_amount)
        ).toString()
        _zero_sales_amount = Math.round(
          convertToFloat(_zero_sales_amount)
        ).toString()
        _total_amount = Math.round(convertToFloat(_total_amount)).toString()
        _tax_amount = Math.round(convertToFloat(_tax_amount)).toString()

        if (_indexId !== _id) {
          if (_indexId !== '') {
            //處理 mig xml 檔
            var _mig_xml = xml.Parser.toString({
              document: _xmlDocument,
            })

            if (voucher_type === 'EGUI') {
              if (_pre_mig_type === 'B2BS') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
                )
                if (_pre_tax_type !== '2') {
                  //非零稅要拿掉
                  _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
                }
                if (_pre_buyer == '0000000000') {
                  //B2C +C0401
                  _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
                }
              } else if (_pre_mig_type === 'B2BE') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0101:3.1"'
                )
              } else if (_pre_mig_type === 'B2C') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
                )
                if (_pre_tax_type != '2') {
                  //非零稅要拿掉
                  _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
                }
                if (_pre_buyer == '0000000000') {
                  //B2C +C0401
                  _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
                }
              }
            } else {
              //ALLOWANCE
              if (_pre_mig_type === 'B2BS') {
                //_mig_xml = _mig_xml.replace('Allowance', 'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0401:3.1"');
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
                )
              } else if (_pre_mig_type === 'B2BE') {
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0101:3.1"'
                )
              } else if (_pre_mig_type === 'B2C') {
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
                )
              }
            }
            //A0101-AX123456789-123
            var _xml_mig_type = getMigType('APPLY', voucher_type, _pre_mig_type)
            var _file_name =
              _xml_mig_type + '-' + _pre_voucher_number + '-' + _pre_apply_id

            //判斷是否是開立或作廢
            var _data_type = '2' //開立
            if (_pre_voucher_status.indexOf('CANCEL') != -1) {
              //作廢
              _data_type = '3' //作廢
            }
            var _jsonObj = {
              apply_id: _pre_apply_id,
              data_type: _data_type,
              mig_type: _xml_mig_type,
              file_name: _file_name,
              is_printed: _pre_is_printed,
              is_printed_pdf: _pre_is_printed_pdf,
              is_printed_paper: _pre_is_printed_paper,
              extra_memo: _pre_voucher_extra_memo,
              need_upload_egui_mig: _pre_need_upload_egui_mig,
              mig_xml: _mig_xml,
            }
            _jsonObjAry.push(_jsonObj)
            _isFirst = true
          }

          //要記錄下一筆的migType
          if (_mig_type === 'B2BS') {
            _xmlDocument = xml.Parser.fromString({
              text: b2c_xml,
            })
          } else if (_mig_type === 'B2BE') {
            _xmlDocument = xml.Parser.fromString({
              text: b2be_xml,
            })
          } else if (_mig_type === 'B2C') {
            _xmlDocument = xml.Parser.fromString({
              text: b2c_xml,
            })
          }

          if (voucher_type === 'EGUI') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceNumber',
              _voucher_number
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceDate',
              _voucher_date
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceTime',
              _voucher_time
            )
          } else {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceNumber',
              _voucher_number
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceDate',
              _voucher_date
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceType',
              '2'
            )
          }
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Identifier',
            _seller
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Name',
            _seller_name
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Address',
            _seller_address
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Identifier',
            _buyer
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Name',
            _buyer_name
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Address',
            _buyer_address
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'InvoiceType',
            _invoice_type
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'RandomNumber',
            _random_number
          )

          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'MainRemark',
            _main_remark
          )
          if (voucher_type === 'EGUI' && _tax_type == '2') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CustomsClearanceMark',
              _clearance_mark
            )
          }
          if (voucher_type === 'EGUI' && _buyer != '0000000000') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'RelateNumber',
              _id
            )
          }
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'PrintMark',
            _print_mark
          )

          if (_mig_type === 'B2C') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierType',
              _carrier_type
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierId1',
              _carrierid1
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierId2',
              _carrierid2
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'NPOBAN',
              _npoban
            )
          }
          //DonateMark
          var _donateMark = '0'
		  if (_npoban != '') _donateMark= '1'
		   
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'DonateMark',
            _donateMark
          )  

          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'SalesAmount',
            _sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'FreeTaxSalesAmount',
            _free_sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'ZeroTaxSalesAmount',
            _zero_sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxAmount',
            _tax_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxRate',
            _tax_rate
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxType',
            _tax_type
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TotalAmount',
            _total_amount
          )

          _indexId = _id
        }

        //Item Details
        var _item_description =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_description'
          ]
        var _unit_price =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_unit_price'
          ]
        var _item_quantity =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_quantity'
          ]
        //20210322 walter modify
        //var _original_item_quantity = _item_quantity;
        var _dtl_item_tax_code =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_dtl_item_tax_code'
          ]
        var _dtl_item_tax_rate =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_dtl_item_tax_rate'
          ] //5
        _dtl_item_tax_rate.replace('%', '')

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //20201110 walter 紀錄原始Netsuite資料內容
        var _item_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_amount'
          ]
        var _item_tax_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_tax_amount'
          ]
        var _item_total_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_total_amount'
          ]

        //20201123 walter modify
        if (convertToFloat(_item_tax_amount) == 0) {
          _item_tax_amount = (
            (convertToFloat(_item_amount) *
              convertToFloat(_dtl_item_tax_rate)) /
            100
          ).toString()
        }
        if (convertToFloat(_item_total_amount) == 0) {
          _item_total_amount = (
            convertToFloat(_item_amount) + convertToFloat(_item_tax_amount)
          ).toString()
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var _item_seq =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_seq'
          ]
        var _item_remark =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_remark'
          ]
        var _item_unit =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_unit'
          ]
        var _original_gui_number =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_number'
          ]
        var _original_gui_date =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_date'
          ]
        var _original_gui_yearmonth =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_yearmonth'
          ]
        /**
        var _item_tax_type = gwconfigure.getGwTaxTypeFromNSTaxCode(
          _dtl_item_tax_code
        )
        */
        var _item_tax_type = getTaxTypeByTaxCode(_dtl_item_tax_code) 
       
        //折讓單的稅別要四捨五入(_allowanceTaxAmount)
        var _allowanceTaxAmount = Math.round(
          convertToFloat(_item_tax_amount)
        ).toString()
        if (_upload_access_model == _GATEWEB_MODEL) {
          _allowanceTaxAmount = Math.round(
            (convertToFloat(_item_amount) *
              convertToFloat(_dtl_item_tax_rate)) /
              100
          ).toString()
        }
        //////////////////////////////////////////////////////////////////////////////////////
        //把小數點.0拿掉
        //20210322 walter modify 數量小數點
        //_item_quantity     = (Math.round(convertToFloat(_item_quantity))).toString();
        _dtl_item_tax_rate = Math.round(
          convertToFloat(_dtl_item_tax_rate)
        ).toString()
        //_item_amount       = (Math.round((stringutility.convertToFloat(_item_amount)))).toString();
        //////////////////////////////////////////////////////////////////////////////////////
        if (
          voucher_type === 'EGUI' &&
          _mig_type !== 'B2E' &&
          _buyer == '0000000000'
        ) {
          //C0401(0000000000) 單價要含稅 ,要相容以前資料
          if (
            _upload_access_model == _GATEWEB_MODEL ||
            convertToFloat(_item_total_amount) == 0
          ) {
            //_item_amount = Math.round( convertToFloat(_item_quantity) * convertToFloat(_unit_price) * (1 + convertToFloat(_dtl_item_tax_rate)/100) ).toString();
            _item_amount = Math.round(
              convertToFloat(_item_amount) *
                (1 + convertToFloat(_dtl_item_tax_rate) / 100)
            ).toString()
          } else {
            _item_amount = _item_total_amount
          }
        }
        //20201102 walter modify _unit_price = _item_amount /_item_quantity
        if (convertToFloat(_item_quantity) != 0) {
          _unit_price = (
            convertToFloat(_item_amount) / convertToFloat(_item_quantity)
          )
            .toFixed(_numericToFixed)
            .toString()
        } else {
          _unit_price = '0'
        }

        if (voucher_type === 'EGUI') {
          setEGUIXmlDetailsItemValue(
            _xmlDocument,
            _isFirst,
            _item_description,
            _item_quantity,
            _item_unit,
            _unit_price,
            _item_amount,
            _item_seq,
            _item_remark
          )
        } else {
          setAllowanceXmlDetailsItemValue(
            _xmlDocument,
            _select_path,
            _isFirst,
            _item_description,
            _item_quantity,
            _item_unit,
            _unit_price,
            _item_amount,
            _item_seq,
            _item_remark,
            _original_gui_number,
            _original_gui_date,
            _item_tax_type,
            _allowanceTaxAmount
          )
        }

        _isFirst = false

        _pre_apply_id = _id
        _pre_mig_type = _mig_type
        _pre_is_printed = _is_printed
        _pre_is_printed_pdf = _is_printed_pdf
        _pre_is_printed_paper = _is_printed_paper
        _pre_voucher_extra_memo = _voucher_extra_memo
        _pre_need_upload_egui_mig = _need_upload_egui_mig
        _pre_buyer = _buyer
        _pre_tax_type = _tax_type
        _pre_voucher_number = _voucher_number
        _pre_voucher_status = _voucher_status
        _pre_upload_status = _upload_status

        return true
      })

      //有資料才做
      if (_pre_apply_id != 0) {
        var _mig_xml = xml.Parser.toString({
          document: _xmlDocument,
        })
        if (voucher_type === 'EGUI') {
          if (_pre_mig_type === 'B2BS') {
            //_mig_xml = _mig_xml.replace('Invoice', 'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0401:3.1"');
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
            )
            //_mig_xml = _mig_xml.replace('Invoice', 'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:GEINV:eInvoiceMessage:C0401:3.1 C0401.xsd"');
            if (_pre_tax_type !== '2') {
              //非零稅要拿掉
              _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
            }
            if (_pre_buyer == '0000000000') {
              //B2C +C0401
              _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
            }
          } else if (_pre_mig_type === 'B2BE') {
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0101:3.1"'
            )
          } else if (_pre_mig_type === 'B2C') {
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
            )
            if (_pre_tax_type !== '2') {
              //非零稅要拿掉
              _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
            }
            if (_pre_buyer == '0000000000') {
              //B2C +C0401
              _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
            }
          }
        } else {
          //ALLOWANCE
          if (_pre_mig_type === 'B2BS') {
            //_mig_xml = _mig_xml.replace('Allowance', 'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0401:3.1"');
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
            )
          } else if (_pre_mig_type === 'B2BE') {
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0101:3.1"'
            )
          } else if (_pre_mig_type === 'B2C') {
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
            )
          }
        }

        //A0101-AX123456789-123
        var _xml_mig_type = getMigType('APPLY', voucher_type, _pre_mig_type)
        var _file_name =
          _xml_mig_type + '-' + _pre_voucher_number + '-' + _pre_apply_id

        //判斷是否是開立或作廢
        var _data_type = '2' //開立
        if (_pre_voucher_status.indexOf('CANCEL') != -1) {
          //作廢
          _data_type = '3' //作廢
        }
        var _jsonObj = {
          apply_id: _pre_apply_id,
          data_type: _data_type,
          mig_type: _xml_mig_type,
          file_name: _file_name,
          is_printed: _pre_is_printed,
          is_printed_pdf: _pre_is_printed_pdf,
          is_printed_paper: _pre_is_printed_paper,
          extra_memo: _pre_voucher_extra_memo,
          need_upload_egui_mig: _pre_need_upload_egui_mig,
          mig_xml: _mig_xml,
        }
        _jsonObjAry.push(_jsonObj)
      }
    } catch (e) {
      genxml_toftp_result = 'N'
      genxml_toftp_message = e.message
      log.debug(e.name, e.message)
    }

    return _jsonObjAry
  }
  

  //20201110 開立模式判斷=>access_model [NETSUITE, GATEWEB]
  function getVoucherToDoList(
    access_model,
    voucher_type,
    voucher_list_id,
    b2bs_xml,
    b2be_xml,
    b2c_xml,
    genxml_toftp_result,
    genxml_toftp_message,
    select_error_item
  ) {
    var _jsonObjAry = []

    try {
      var _idAry = voucher_list_id.split(',')
      var _xmlDocument
      var _mySearch = search.load({
        id: _gw_voucher_main_search_id,
      })
      var _filterArray = []
      _filterArray.push(['internalId', search.Operator.ANYOF, _idAry])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_type',
        search.Operator.IS,
        voucher_type,
      ])
      
      if (select_error_item==true){
	      _filterArray.push('and');
	      _filterArray.push(['custrecord_gw_voucher_upload_status',search.Operator.ISNOT, 'E']); 
	      _filterArray.push('and');
	      _filterArray.push(['custrecord_gw_invoice_type',search.Operator.IS, '07']); 
	      //custrecord_gw_voucher_format_code
	      _filterArray.push('and'); 
	      _filterArray.push([
	          ['custrecord_gw_voucher_format_code', search.Operator.IS, '35'],
	          'or',
	          ['custrecord_gw_voucher_format_code', search.Operator.IS, '33']
	      ])
	      
	  } 

      _mySearch.filterExpression = _filterArray

      var _indexId = ''
      var _isFirst = true
      var _pre_mig_type = ''
      var _pre_apply_id = 0
      var _pre_voucher_number = ''
      var _pre_buyer = ''
      var _pre_tax_type = ''
      var _pre_is_printed = false
      var _pre_is_printed_pdf = false
      var _pre_is_printed_paper = false
      var _pre_voucher_extra_memo = ''
      //20201002 walter modify 判斷是否上傳(NONE)
      var _pre_need_upload_egui_mig = 'ALL'

      var _pre_voucher_status = ''
      var _pre_upload_status = ''
      var _select_path = 'Invoice'
      if (voucher_type !== 'EGUI') _select_path = 'Allowance'

      _mySearch.run().each(function (result) {
        var _result = JSON.parse(JSON.stringify(result))
        log.debug('JSON.stringify(result)', JSON.stringify(result))
        //1.Main Information
        var _id = _result.id //948
        var _mig_type = _result.values.custrecord_gw_mig_type //B2BS, B2BE, B2C
        var _voucher_number = _result.values.custrecord_gw_voucher_number
        var _voucher_date = _result.values.custrecord_gw_voucher_date
        var _voucher_time = _result.values.custrecord_gw_voucher_time
        var _voucher_yearmonth = _result.values.custrecord_gw_voucher_yearmonth
        var _seller = _result.values.custrecord_gw_seller
        var _seller_name = _result.values.custrecord_gw_seller_name
        var _seller_address = _result.values.custrecord_gw_seller_address
        var _buyer = _result.values.custrecord_gw_buyer
        var _buyer_name = _result.values.custrecord_gw_buyer_name
        var _buyer_address = _result.values.custrecord_gw_buyer_address
        var _buyer_dept_code = _result.values.custrecord_gw_buyer_dept_code
        var _invoice_type = _result.values.custrecord_gw_invoice_type
        var _carrier_type = _result.values.custrecord_gw_carrier_type
        var _carrierid1 = _result.values.custrecord_gw_carrierid1
        var _carrierid2 = _result.values.custrecord_gw_carrierid2
        var _npoban = _result.values.custrecord_gw_npoban
        var _clearance_mark = _result.values.custrecord_gw_clearance_mark
        var _main_remark = _result.values.custrecord_gw_main_remark
        var _random_number = _result.values.custrecord_gw_random_number
        var _need_upload_egui_mig =
          _result.values.custrecord_gw_need_upload_egui_mig
        var _tax_rate = _result.values.custrecord_gw_tax_rate //0.05
        var _tax_type = _result.values.custrecord_gw_tax_type
        var _total_amount = _result.values.custrecord_gw_total_amount
        var _print_mark = _result.values.custrecord_gw_print_mark
        var _voucher_extra_memo =
          _result.values.custrecord_gw_voucher_extra_memo
        var _upload_access_model =
          _result.values.custrecord_gw_upload_access_model

        //////////////////////////////////////////////////////////////////////////////////////
        //20201110 walter 紀錄了Netsuite原始資料內容
        //////////////////////////////////////////////////////////////////////////////////////
        var _sales_amount = _result.values.custrecord_gw_sales_amount
        var _free_sales_amount = _result.values.custrecord_gw_free_sales_amount
        var _zero_sales_amount = _result.values.custrecord_gw_zero_sales_amount

        var _tax_amount = _result.values.custrecord_gw_tax_amount
        var _total_amount = _result.values.custrecord_gw_total_amount
        //////////////////////////////////////////////////////////////////////////////////////

        //處理 Print 紀錄
        var _is_printed = false //_mig_type
        var _is_printed_paper = _result.values.custrecord_gw_is_printed_paper
        var _is_printed_pdf = _result.values.custrecord_gw_is_printed_pdf
        if (_is_printed_paper == true || _is_printed_pdf == true)
          _is_printed = true

        //發票狀態VOUCHER_XXXX, CANCEL_XXXX
        var _voucher_status = _result.values.custrecord_gw_voucher_status
        // A==>P==> C or E or G
        var _upload_status = _result.values.custrecord_gw_voucher_upload_status

        //四捨五入
        if (convertToFloat(_tax_rate) == 0) {
          //0.00
          _tax_rate = '0'
        }
        //判斷B2C , C0401的相關欄位計算
        //20201110 walter modify
        if (_upload_access_model == _GATEWEB_MODEL) {
          _tax_amount = Math.round(
            convertToFloat(_sales_amount) * 0.05
          ).toString()

          _total_amount = Math.round(
            convertToFloat(_sales_amount) +
              convertToFloat(_free_sales_amount) +
              convertToFloat(_zero_sales_amount) +
              convertToFloat(_tax_amount)
          ).toString()
        }

        if (
          voucher_type == 'EGUI' &&
          _mig_type != 'B2E' &&
          _buyer == '0000000000'
        ) {
          //C0401(0000000000) 的發票，這裡要含稅金
          _sales_amount = Math.round(
            convertToFloat(_sales_amount) + convertToFloat(_tax_amount)
          ).toString()
          _tax_amount = '0' //B2C的發票，稅金為 0
        } else if (voucher_type == 'ALLOWANCE') {
          _sales_amount = Math.round(convertToFloat(_sales_amount)).toString()
          //折讓單要放未稅金額
          _total_amount = (
            convertToFloat(_sales_amount) +
            convertToFloat(_free_sales_amount) +
            convertToFloat(_zero_sales_amount)
          ).toString()
        } else {
          //C0401(非0000000000)
          _sales_amount = Math.round(convertToFloat(_sales_amount)).toString()
        }

        _free_sales_amount = Math.round(
          convertToFloat(_free_sales_amount)
        ).toString()
        _zero_sales_amount = Math.round(
          convertToFloat(_zero_sales_amount)
        ).toString()
        _total_amount = Math.round(convertToFloat(_total_amount)).toString()
        _tax_amount = Math.round(convertToFloat(_tax_amount)).toString()

        if (_indexId !== _id) {
          if (_indexId !== '') {
            //處理 mig xml 檔
            var _mig_xml = xml.Parser.toString({
              document: _xmlDocument,
            })

            if (voucher_type === 'EGUI') {
              if (_pre_mig_type === 'B2BS') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
                )
                if (_pre_tax_type !== '2') {
                  //非零稅要拿掉
                  _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
                }
                if (_pre_buyer == '0000000000') {
                  //B2C +C0401
                  _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
                }
              } else if (_pre_mig_type === 'B2BE') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0101:3.1"'
                )
              } else if (_pre_mig_type === 'B2C') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
                )
                if (_pre_tax_type != '2') {
                  //非零稅要拿掉
                  _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
                }
                if (_pre_buyer == '0000000000') {
                  //B2C +C0401
                  _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
                }
              }
            } else {
              //ALLOWANCE
              if (_pre_mig_type === 'B2BS') {
                //_mig_xml = _mig_xml.replace('Allowance', 'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0401:3.1"');
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
                )
              } else if (_pre_mig_type === 'B2BE') {
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0101:3.1"'
                )
              } else if (_pre_mig_type === 'B2C') {
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
                )
              }
            }
            //A0101-AX123456789-123
            var _xml_mig_type = getMigType('APPLY', voucher_type, _pre_mig_type)
            var _file_name =
              _xml_mig_type + '-' + _pre_voucher_number + '-' + _pre_apply_id

            //判斷是否是開立或作廢
            var _data_type = '2' //開立
            if (_pre_voucher_status.indexOf('CANCEL') != -1) {
              //作廢
              _data_type = '3' //作廢
            }
            var _jsonObj = {
              apply_id: _pre_apply_id,
              data_type: _data_type,
              mig_type: _xml_mig_type,
              file_name: _file_name,
              is_printed: _pre_is_printed,
              is_printed_pdf: _pre_is_printed_pdf,
              is_printed_paper: _pre_is_printed_paper,
              extra_memo: _pre_voucher_extra_memo,
              need_upload_egui_mig: _pre_need_upload_egui_mig,
              mig_xml: _mig_xml,
            }
            _jsonObjAry.push(_jsonObj)
            _isFirst = true
          }

          //要記錄下一筆的migType
          if (_mig_type === 'B2BS') {
            _xmlDocument = xml.Parser.fromString({
              text: b2c_xml,
            })
          } else if (_mig_type === 'B2BE') {
            _xmlDocument = xml.Parser.fromString({
              text: b2be_xml,
            })
          } else if (_mig_type === 'B2C') {
            _xmlDocument = xml.Parser.fromString({
              text: b2c_xml,
            })
          }

          if (voucher_type === 'EGUI') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceNumber',
              _voucher_number
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceDate',
              _voucher_date
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceTime',
              _voucher_time
            )
          } else {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceNumber',
              _voucher_number
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceDate',
              _voucher_date
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceType',
              '2'
            )
          }
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Identifier',
            _seller
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Name',
            _seller_name
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Address',
            _seller_address
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Identifier',
            _buyer
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Name',
            _buyer_name
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Address',
            _buyer_address
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'InvoiceType',
            _invoice_type
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'RandomNumber',
            _random_number
          )

          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'MainRemark',
            _main_remark
          )
          if (voucher_type === 'EGUI' && _tax_type == '2') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CustomsClearanceMark',
              _clearance_mark
            )
          }
          if (voucher_type === 'EGUI' && _buyer != '0000000000') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'RelateNumber',
              _id
            )
          }
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'PrintMark',
            _print_mark
          )

          if (_mig_type === 'B2C') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierType',
              _carrier_type
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierId1',
              _carrierid1
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierId2',
              _carrierid2
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'NPOBAN',
              _npoban
            )
          }
          //DonateMark
          var _donateMark = '0'
		  if (_npoban != '') _donateMark= '1'
		   
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'DonateMark',
            _donateMark
          )  

          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'SalesAmount',
            _sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'FreeTaxSalesAmount',
            _free_sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'ZeroTaxSalesAmount',
            _zero_sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxAmount',
            _tax_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxRate',
            _tax_rate
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxType',
            _tax_type
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TotalAmount',
            _total_amount
          )

          _indexId = _id
        }

        //Item Details
        var _item_description =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_description'
          ]
        var _unit_price =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_unit_price'
          ]
        var _item_quantity =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_quantity'
          ]
        //20210322 walter modify
        //var _original_item_quantity = _item_quantity;
        var _dtl_item_tax_code =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_dtl_item_tax_code'
          ]
        var _dtl_item_tax_rate =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_dtl_item_tax_rate'
          ] //5
        _dtl_item_tax_rate.replace('%', '')

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //20201110 walter 紀錄原始Netsuite資料內容
        var _item_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_amount'
          ]
        var _item_tax_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_tax_amount'
          ]
        var _item_total_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_total_amount'
          ]

        //20201123 walter modify
        if (convertToFloat(_item_tax_amount) == 0) {
          _item_tax_amount = (
            (convertToFloat(_item_amount) *
              convertToFloat(_dtl_item_tax_rate)) /
            100
          ).toString()
        }
        if (convertToFloat(_item_total_amount) == 0) {
          _item_total_amount = (
            convertToFloat(_item_amount) + convertToFloat(_item_tax_amount)
          ).toString()
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var _item_seq =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_seq'
          ]
        var _item_remark =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_remark'
          ]
        var _item_unit =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_unit'
          ]
        var _original_gui_number =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_number'
          ]
        var _original_gui_date =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_date'
          ]
        var _original_gui_yearmonth =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_yearmonth'
          ]
        /**
        var _item_tax_type = gwconfigure.getGwTaxTypeFromNSTaxCode(
          _dtl_item_tax_code
        )
        */
        var _item_tax_type = getTaxTypeByTaxCode(_dtl_item_tax_code) 
     
        //折讓單的稅別要四捨五入(_allowanceTaxAmount)
        var _allowanceTaxAmount = Math.round(
          convertToFloat(_item_tax_amount)
        ).toString()
        if (_upload_access_model == _GATEWEB_MODEL) {
          _allowanceTaxAmount = Math.round(
            (convertToFloat(_item_amount) *
              convertToFloat(_dtl_item_tax_rate)) /
              100
          ).toString()
        }
        //////////////////////////////////////////////////////////////////////////////////////
        //把小數點.0拿掉
        //20210322 walter modify 數量小數點
        //_item_quantity     = (Math.round(convertToFloat(_item_quantity))).toString();
        _dtl_item_tax_rate = Math.round(
          convertToFloat(_dtl_item_tax_rate)
        ).toString()
        //_item_amount       = (Math.round((stringutility.convertToFloat(_item_amount)))).toString();
        //////////////////////////////////////////////////////////////////////////////////////
        if (
          voucher_type === 'EGUI' &&
          _mig_type !== 'B2E' &&
          _buyer == '0000000000'
        ) {
          //C0401(0000000000) 單價要含稅 ,要相容以前資料
          if (
            _upload_access_model == _GATEWEB_MODEL ||
            convertToFloat(_item_total_amount) == 0
          ) {
            //_item_amount = Math.round( convertToFloat(_item_quantity) * convertToFloat(_unit_price) * (1 + convertToFloat(_dtl_item_tax_rate)/100) ).toString();
            _item_amount = Math.round(
              convertToFloat(_item_amount) *
                (1 + convertToFloat(_dtl_item_tax_rate) / 100)
            ).toString()
          } else {
            _item_amount = _item_total_amount
          }
        }
        //20201102 walter modify _unit_price = _item_amount /_item_quantity

        var unitPriceRule = ['', null, 0, '0']
        if(unitPriceRule.indexOf(_unit_price) !== -1) {
          if (convertToFloat(_item_quantity) != 0) {
            _unit_price = (
                convertToFloat(_item_amount) / convertToFloat(_item_quantity)
            )
                .toFixed(_numericToFixed)
                .toString()
          } else {
            _unit_price = '0'
          }
        } else {
          _unit_price = parseFloat(_unit_price).toFixed(_numericToFixed)
        }

        if (voucher_type === 'EGUI') {
          setEGUIXmlDetailsItemValue(
            _xmlDocument,
            _isFirst,
            _item_description,
            _item_quantity,
            _item_unit,
            _unit_price,
            _item_amount,
            _item_seq,
            _item_remark
          )
        } else {
          setAllowanceXmlDetailsItemValue(
            _xmlDocument,
            _select_path,
            _isFirst,
            _item_description,
            _item_quantity,
            _item_unit,
            _unit_price,
            _item_amount,
            _item_seq,
            _item_remark,
            _original_gui_number,
            _original_gui_date,
            _item_tax_type,
            _allowanceTaxAmount
          )
        }

        _isFirst = false

        _pre_apply_id = _id
        _pre_mig_type = _mig_type
        _pre_is_printed = _is_printed
        _pre_is_printed_pdf = _is_printed_pdf
        _pre_is_printed_paper = _is_printed_paper
        _pre_voucher_extra_memo = _voucher_extra_memo
        _pre_need_upload_egui_mig = _need_upload_egui_mig
        _pre_buyer = _buyer
        _pre_tax_type = _tax_type
        _pre_voucher_number = _voucher_number
        _pre_voucher_status = _voucher_status
        _pre_upload_status = _upload_status

        return true
      })

      //有資料才做
      if (_pre_apply_id != 0) {
        var _mig_xml = xml.Parser.toString({
          document: _xmlDocument,
        })
        if (voucher_type === 'EGUI') {
          if (_pre_mig_type === 'B2BS') {
            //_mig_xml = _mig_xml.replace('Invoice', 'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0401:3.1"');
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
            )
            //_mig_xml = _mig_xml.replace('Invoice', 'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:GEINV:eInvoiceMessage:C0401:3.1 C0401.xsd"');
            if (_pre_tax_type !== '2') {
              //非零稅要拿掉
              _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
            }
            if (_pre_buyer == '0000000000') {
              //B2C +C0401
              _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
            }
          } else if (_pre_mig_type === 'B2BE') {
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0101:3.1"'
            )
          } else if (_pre_mig_type === 'B2C') {
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
            )
            if (_pre_tax_type !== '2') {
              //非零稅要拿掉
              _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
            }
            if (_pre_buyer == '0000000000') {
              //B2C +C0401
              _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
            }
          }
        } else {
          //ALLOWANCE
          if (_pre_mig_type === 'B2BS') {
            //_mig_xml = _mig_xml.replace('Allowance', 'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0401:3.1"');
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
            )
          } else if (_pre_mig_type === 'B2BE') {
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0101:3.1"'
            )
          } else if (_pre_mig_type === 'B2C') {
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
            )
          }
        }

        //A0101-AX123456789-123
        var _xml_mig_type = getMigType('APPLY', voucher_type, _pre_mig_type)
        var _file_name =
          _xml_mig_type + '-' + _pre_voucher_number + '-' + _pre_apply_id

        //判斷是否是開立或作廢
        var _data_type = '2' //開立
        if (_pre_voucher_status.indexOf('CANCEL') != -1) {
          //作廢
          _data_type = '3' //作廢
        }
        var _jsonObj = {
          apply_id: _pre_apply_id,
          data_type: _data_type,
          mig_type: _xml_mig_type,
          file_name: _file_name,
          is_printed: _pre_is_printed,
          is_printed_pdf: _pre_is_printed_pdf,
          is_printed_paper: _pre_is_printed_paper,
          extra_memo: _pre_voucher_extra_memo,
          need_upload_egui_mig: _pre_need_upload_egui_mig,
          mig_xml: _mig_xml,
        }
        _jsonObjAry.push(_jsonObj)
      }
    } catch (e) {
      genxml_toftp_result = 'N'
      genxml_toftp_message = e.message
      log.debug(e.name, e.message)
    }

    return _jsonObjAry
  }

  //處理發票資料-END
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getConfigureValue(group_type, voucher_property_value) {
    var _result = ''
    try {
      var _mySearch = search.create({
        type: _gw_voucher_properties,
        columns: [
          search.createColumn({ name: 'custrecord_gw_voucher_property_id' }),
          search.createColumn({ name: 'custrecord_gw_voucher_property_value' }),
          search.createColumn({ name: 'custrecord_gw_voucher_property_note' }),
          search.createColumn({ name: 'custrecord_gw_netsuite_id_value' }),
          search.createColumn({ name: 'custrecord_gw_netsuite_id_text' }),
        ],
      })

      var _filterArray = []
      _filterArray.push([
        'custrecord_gw_voucher_group_type',
        search.Operator.IS,
        group_type,
      ])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_property_id',
        search.Operator.IS,
        voucher_property_value,
      ])

      _mySearch.filterExpression = _filterArray
      _mySearch.run().each(function (result) {
        var internalid = result.id
        _result = result.getValue({
          name: 'custrecord_gw_voucher_property_value',
        })
        return true
      })
    } catch (e) {
      log.debug(e.name, e.message)
    }

    return _result
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  //抓空白發票(CSV)產生 E0402.xml TODO
  function getE0402Xml(
    head_business_no,
    business_no,
    year_month,
    empty_json_obj_ary,
    _temp_e0402_xml
  ) {
    var _e0402_xml_ary = []
    try {
      //1. 逐筆處理xml資料
      var _result_ary_json_obj = prepareJsonObjByInvoiceTrack(
        empty_json_obj_ary
      )

      for (var i = 0; i < _result_ary_json_obj.length; i++) {
        var _json_obj = _result_ary_json_obj[i]

        var _xmlDocument = xml.Parser.fromString({
          text: _temp_e0402_xml,
        })

        //處理xml
        var _business_no = _json_obj.business_no
        var _year_month = _json_obj.year_month
        var _invoice_track = _json_obj.invoice_track
        var _invoice_type = _json_obj.invoice_type

        setXmlMainAndAmountValue(
          _xmlDocument,
          'BranchTrackBlank',
          'Main',
          'HeadBan',
          head_business_no
        )
        setXmlMainAndAmountValue(
          _xmlDocument,
          'BranchTrackBlank',
          'Main',
          'BranchBan',
          _business_no
        )
        setXmlMainAndAmountValue(
          _xmlDocument,
          'BranchTrackBlank',
          'Main',
          'InvoiceType',
          _invoice_type
        )
        setXmlMainAndAmountValue(
          _xmlDocument,
          'BranchTrackBlank',
          'Main',
          'YearMonth',
          _year_month
        )
        setXmlMainAndAmountValue(
          _xmlDocument,
          'BranchTrackBlank',
          'Main',
          'InvoiceTrack',
          _invoice_track
        )

        //明細資料
        var _item_ary_obj = _json_obj.item_ary_obj

        for (var j = 0; j < _item_ary_obj.length; j++) {
          var _is_first = false
          var _item_json_obj = _item_ary_obj[j]
          var _invoice_begin_no = _item_json_obj.start_no
          var _invoice_end_no = _item_json_obj.end_no

          if (j == 0) _is_first = true
          setE0402DetailsItemValue(
            _xmlDocument,
            _is_first,
            _invoice_begin_no,
            _invoice_end_no
          )
        }
        var _mig_xml = xml.Parser.toString({
          document: _xmlDocument,
        })
        _mig_xml = _mig_xml.replace(
          'BranchTrackBlank',
          'BranchTrackBlank xmlns="urn:GEINV:eInvoiceMessage:E0402:3.2"'
        )

        var _mig_file_name =
          business_no +
          '_' +
          year_month +
          '_' +
          _invoice_track +
          '_' +
          _invoice_type +
          '_E0402.xml'

        var _e0402_xml_json_obj = {
          business_no: business_no,
          year_month: year_month,
          invoice_track: _invoice_track,
          invoice_type: _invoice_type,
          mig_xml: _mig_xml,
        }
        _e0402_xml_ary.push(_e0402_xml_json_obj)
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }
    return _e0402_xml_ary
  }

  //依字軌排序
  function prepareJsonObjByInvoiceTrack(empty_json_obj_ary) {
    var _json_obj_ary = []
    try {
      for (var i = 0; i < empty_json_obj_ary.length; i++) {
        var _array_obj = empty_json_obj_ary[i]

        var _business_no = _array_obj[1]
        var _year_month = _array_obj[2]
        var _invoice_track = _array_obj[3]
        var _start_no = _array_obj[4]
        var _end_no = _array_obj[5]
        var _invoice_type = _array_obj[6]

        var _json_obj = {
          business_no: _business_no,
          year_month: _year_month,
          invoice_track: _invoice_track,
          start_no: _start_no,
          end_no: _end_no,
          invoice_type: _invoice_type,
        }

        //統編+期別+發票類別(07, 08)+字軌
        var _index_string =
          _business_no + _year_month + _invoice_type + _invoice_track

        var _exist = false
        if (_json_obj_ary.length != 0) {
          for (var j = 0; j < _json_obj_ary.length; j++) {
            var _item_json_obj = _json_obj_ary[j]
            var _ary_index_string = _item_json_obj.index_string

            if (_ary_index_string == _index_string) {
              var _item_ary_obj = _item_json_obj.item_ary_obj
              _item_ary_obj.push(_json_obj)
              _exist = true
              break
            }
          }
        }
        if (_exist == false) {
          var _item_ary_obj = []
          _item_ary_obj.push(_json_obj)
          var _array_json_obj = {
            index_string: _index_string,
            business_no: _business_no,
            year_month: _year_month,
            invoice_track: _invoice_track,
            invoice_type: _invoice_type,
            item_ary_obj: _item_ary_obj,
          }
          _json_obj_ary.push(_array_json_obj)
        }
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }
    return _json_obj_ary
  }

  function setE0402DetailsItemValue(
    _xmlDocument,
    isFirst,
    invoice_begin_no,
    invoice_end_no
  ) {
    try {
      //BranchTrackBlank.Details.BranchTrackBlankItem.[InvoiceBeginNo,InvoiceEndNo]
      var _detailsNodes = xml.XPath.select({
        node: _xmlDocument,
        xpath: 'BranchTrackBlank/Details',
      })
      if (isFirst == true) {
        var _branchTrackBlankItemNodes = xml.XPath.select({
          node: _xmlDocument,
          xpath: 'BranchTrackBlank/Details/BranchTrackBlankItem',
        })
        if (_branchTrackBlankItemNodes.length != 0) {
          _branchTrackBlankItemNodes[0].firstChild.textContent = invoice_begin_no
          _branchTrackBlankItemNodes[0].lastChild.textContent = invoice_end_no
        }
      } else {
        var _lastBranchTrackBlankItemNode = _detailsNodes[0].lastChild
        //clone last node
        var _copiedNode = _lastBranchTrackBlankItemNode.cloneNode({
          deep: true,
        })
        _copiedNode.firstChild.textContent = invoice_begin_no
        _copiedNode.lastChild.textContent = invoice_end_no

        _detailsNodes[0].appendChild(_copiedNode)
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }
  }
  
  function getTaxTypeByTaxCode(dtl_item_tax_code){	   
	  var _tax_type = '1'
	    try {
	      var _mySearch = search.create({
	        type: 'customrecord_gw_ap_doc_tax_type_option',
	        columns: [
	          search.createColumn({ name: 'custrecord_gw_ap_doc_tax_type_value' }),
	          search.createColumn({ name: 'custrecord_gw_tax_type_tax_code' }),
	          search.createColumn({ name: 'custrecord_gw_ap_doc_tax_type_text' }) 
	        ],
	      }) 
	      
	      _mySearch.run().each(function (result) { 	 
	        var internalid = result.id  
	        var _tax_type_list_id = result.getValue({name: 'custrecord_gw_tax_type_tax_code'})
	       
	        if(_tax_type_list_id !='' && _tax_type_list_id==dtl_item_tax_code){
	           _tax_type = result.getValue({name: 'custrecord_gw_ap_doc_tax_type_value'}) 
	        }
	         
	        return true
	      })
	    } catch (e) {
	      log.debug(e.name, e.message)
	      	  
	    } 
	    return _tax_type
  }
		  
		  

  /////////////////////////////////////////////////////////////////////////////////////////////
  return {
    getE0402Xml: getE0402Xml,
    getConfigureValue: getConfigureValue,
    getVoucherToDoList: getVoucherToDoList,
    setXmlMainAndAmountValue: setXmlMainAndAmountValue,
    setEGUIXmlDetailsItemValue: setEGUIXmlDetailsItemValue,
    setAllowanceXmlDetailsItemValue: setAllowanceXmlDetailsItemValue,
  }
})
