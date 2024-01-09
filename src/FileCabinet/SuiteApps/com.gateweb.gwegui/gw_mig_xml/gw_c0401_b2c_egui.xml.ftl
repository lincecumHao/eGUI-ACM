<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1">
    <Main>
        <InvoiceNumber>${guiData.documentNumber}</InvoiceNumber>
        <InvoiceDate>${guiData.documentDate}</InvoiceDate>
        <InvoiceTime>${guiData.documentTime}</InvoiceTime>
        <Seller>
            <Identifier>${guiData.sellerTaxId}</Identifier>
            <Name>${guiData.sellerName}</Name>
            <#if guiData.sellerAddress != ''>
                <Address>${guiData.sellerAddress}</Address>
            </#if>
            <#if guiData.sellerRep != ''>
                <PersonInCharge>${guiData.sellerRep}</PersonInCharge>
            </#if>
            <#if guiData.sellerTel != ''>
                <TelephoneNumber>${guiData.sellerTel}</TelephoneNumber>
            </#if>
            <#if guiData.sellerFax != ''>
                <FacsimileNumber>${guiData.sellerFax}</FacsimileNumber>
            </#if>
            <#if guiData.sellerEmail != ''>
                <EmailAddress>${guiData.sellerEmail}</EmailAddress>
            </#if>
        </Seller>
        <Buyer>
            <Identifier>${guiData.buyerTaxId}</Identifier>
            <Name>${guiData.buyerName}</Name>
            <#if guiData.buyerAddress != ''>
                <Address>${guiData.buyerAddress}</Address>
            </#if>
            <#if guiData.buyerRep != ''>
                <PersonInCharge>${guiData.buyerRep}</PersonInCharge>
            </#if>
            <#if guiData.buyerTel != ''>
                <TelephoneNumber>${guiData.buyerTel}</TelephoneNumber>
            </#if>
            <#if guiData.buyerFax != ''>
                <FacsimileNumber>${guiData.buyerFax}</FacsimileNumber>
            </#if>
            <#if guiData.buyerEmail != ''>
                <EmailAddress>${guiData.buyerEmail}</EmailAddress>
            </#if>
        </Buyer>
        <#if guiData.guiMemo != ''>
            <MainRemark>${guiData.guiMemo}</MainRemark>
        </#if>
        <#if guiData.clearanceMark != ''>
            <CustomsClearanceMark>${guiData.clearanceMark}</CustomsClearanceMark>
        </#if>
        <#if guiData.relateNumber !=''>
            <RelateNumber>${guiData.relateNumber}</RelateNumber>
        </#if>
        <InvoiceType>${guiData.guiType}</InvoiceType>
        <#if guiData.donationCode !=''>
            <DonateMark>1</DonateMark>
        <#else>
            <DonateMark>0</DonateMark>
        </#if>
        <#if guiData.carrierType!=''>
            <CarrierType>${guiData.carrierType}</CarrierType>
        </#if>
        <#if guiData.carrierType!=''>
            <CarrierId1>${guiData.carrierId1}</CarrierId1>
        </#if>
        <#if guiData.carrierType!=''>
            <CarrierId2>${guiData.carrierId2}</CarrierId2>
        </#if>
        <PrintMark>${guiData.printMark}</PrintMark>
        <#if guiData.donationCode !=''>
            <NPOBAN>${guiData.donationCode}</NPOBAN>
        </#if>
        <RandomNumber>${guiData.randomNumber}</RandomNumber>
    </Main>
    <Details>
        <#list guiData.lines as eguiLine>
            <ProductItem>
                <Description>${eguiLine.itemName}</Description>
                <Quantity>${eguiLine.quantity}</Quantity>
                <UnitPrice>${eguiLine.unitPrice}</UnitPrice>
                <Amount>${eguiLine.salesAmt}</Amount>
                <SequenceNumber>${eguiLine.lineSeq}</SequenceNumber>
                <#if eguiLine.itemMemo != ''>
                    <Remark>${eguiLine.itemMemo}</Remark>
                </#if>
                <#if eguiLine.relateNumber != ''>
                    <RelateNumber>${eguiLine.relateNumber}</RelateNumber>
                </#if>
            </ProductItem>
        </#list>
    </Details>
    <Amount>
        <SalesAmount>${guiData.salesAmt}</SalesAmount>
        <FreeTaxSalesAmount>${guiData.taxExemptedSalesAmt}</FreeTaxSalesAmount>
        <ZeroTaxSalesAmount>${guiData.zeroTaxSalesAmt}</ZeroTaxSalesAmount>
        <TaxType>${guiData.taxType}</TaxType>
        <TaxRate>${guiData.taxRate}</TaxRate>
        <TaxAmount>${guiData.taxAmt}</TaxAmount>
        <TotalAmount>${guiData.totalAmt}</TotalAmount>
    </Amount>
</Invoice>