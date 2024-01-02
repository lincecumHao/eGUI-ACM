define(['N/config'], function (config) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  var exports = {}
 
  function getCompanyInfoRecord(){  
	  var companyInfoRecord = config.load({
		  type: config.Type.COMPANY_INFORMATION
	  });
	
	  return companyInfoRecord; 
  } 
  
  function getUserPreferencesRecord(){  
	  var userPreferencesRecord = config.load({
		  type: config.Type.USER_PREFERENCES
	  });
	  
	  return userPreferencesRecord; 
  } 
  
  function getFeaturesRecord(){  
	  var featuresRecord = config.load({
		  type: config.Type.FEATURES
	  });
	  
	  return featuresRecord; 
  } 
  
  function getDateFormat(){  
	  var userPreferencesRecord = getUserPreferencesRecord();	  
	  return userPreferencesRecord.getValue('DATEFORMAT'); 
  } 
  
  function isOneWorldVersion(){  
	  var isOneWorld = false;
	  var featuresRecord = getFeaturesRecord();
	  var acctSubsidiary = featuresRecord['multisubsidiarycustomer']; 
	  if (acctSubsidiary === true || acctSubsidiary === false) {  
		 isOneWorld = true;  
	  } else {
		 isOneWorld = false;  
	  }
	  
	  return isOneWorld; 
  } 

  exports.getDateFormat = getDateFormat
  exports.isOneWorldVersion = isOneWorldVersion 
  
  return exports
})
