<?xml version="1.0" encoding="utf-8"?>
<Invoice>
    <Main>
        <InvoiceNumber>${guiData.documentNumber}</InvoiceNumber>
        <InvoiceDate>${guiData.documentDate}</InvoiceDate>
        <InvoiceTime>${guiData.documentTime}</InvoiceTime>
        <Seller>
            <Identifier>${guiData.sellerTaxId}</Identifier>
            <Name>${guiData.sellerName}</Name>
            <#if guiData.sellerAddress == null || guiData.sellerAddress ==''>
                <Address>${guiData.sellerAddress}</Address>
            </#if>
            <#if guiData.sellerRep == null || guiData.sellerRep ==''>
                <PersonInCharge>${guiData.sellerRep}</PersonInCharge>
            </#if>
            <#if guiData.sellerTel == null || guiData.sellerTel ==''>
                <TelephoneNumber>${guiData.sellerTel}</TelephoneNumber>
            </#if>
            <#if guiData.sellerFax == null || guiData.sellerFax ==''>
                <FacsimileNumber>${guiData.sellerFax}</FacsimileNumber>
            </#if>
            <#if guiData.sellerEmail == null || guiData.sellerEmail ==''>
                <EmailAddress>${guiData.sellerEmail}</EmailAddress>
            </#if>
        </Seller>
        <Buyer>
            <Identifier>${guiData.buyerTaxId}</Identifier>
            <Name>${guiData.buyerName}</Name>
            <#if guiData.buyerAddress == null || guiData.buyerAddress ==''>
                <Address>${guiData.buyerAddress}</Address>
            </#if>
            <#if guiData.buyerRep == null || guiData.buyerRep ==''>
                <PersonInCharge>${guiData.buyerRep}</PersonInCharge>
            </#if>
            <#if guiData.buyerTel == null || guiData.buyerTel ==''>
                <TelephoneNumber>${guiData.buyerTel}</TelephoneNumber>
            </#if>
            <#if guiData.buyerFax == null || guiData.buyerFax ==''>
                <FacsimileNumber>${guiData.buyerFax}</FacsimileNumber>
            </#if>
            <#if guiData.buyerEmail == null || guiData.buyerEmail ==''>
                <EmailAddress>${guiData.buyerEmail}</EmailAddress>
            </#if>
        </Buyer>
        <MainRemark>${guiData.guiMemo}</MainRemark>
        <#if guiData.clearanceMark == null || guiData.clearanceMark ==''>
            <CustomsClearanceMark>${guiData.clearanceMark}</CustomsClearanceMark>
        </#if>
        <#if guiData.relateNumber == null || guiData.relateNumber ==''>
            <RelateNumber>${guiData.relateNumber}</RelateNumber>
        </#if>
        <InvoiceType>${guiData.documentDate}</InvoiceType>
        <DonateMark>${guiData.documentDate}</DonateMark>
        <CarrierType>${guiData.carrierType}</CarrierType>
        <CarrierId1>${guiData.carrierId1}</CarrierId1>
        <CarrierId2>${guiData.carrierId2}</CarrierId2>
        <PrintMark>${guiData.printMark}</PrintMark>
        <NPOBAN>${guiData.donationCode}</NPOBAN>
        <RandomNumber>${guiData.randomNumber}</RandomNumber>
    </Main>
    <Details>
        <ProductItem>
            <Description>${guiData.documentType}</Description>
            <Quantity>${guiData.documentType}</Quantity>
            <Unit>${guiData.documentType}</Unit>
            <UnitPrice>${guiData.documentType}</UnitPrice>
            <Amount>${guiData.documentType}</Amount>
            <SequenceNumber>${guiData.documentType}</SequenceNumber>
            <Remark>${guiData.documentType}</Remark>
        </ProductItem>
    </Details>
    <Amount>
        <SalesAmount>${guiData.salesAmt}</SalesAmount>
        <FreeTaxSalesAmount>${guiData.taxExemptedSalesAmt}</FreeTaxSalesAmount>
        <ZeroTaxSalesAmount>${guiData.zeroTaxSalesAmt}</ZeroTaxSalesAmount>
        <TaxType>${guiData.taxType.value}</TaxType>
        <TaxRate>${guiData.taxRate}</TaxRate>
        <TaxAmount>${guiData.taxAmount}</TaxAmount>
        <TotalAmount>${guiData.totalAmount}</TotalAmount>
    </Amount>
</Invoice>