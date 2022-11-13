const  CustomersModel = require(  "../models/CustomersModel" );
const PendingIncomingsModel = require  ("../models/PendingIncomingsModel");



function telephoneCheck(str) {
    var patt = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
    return patt.test(str);
}
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
const notifyWebsiteCompanyOnline =()=>{

}


const saveCustomerIncomingMessageWebsiteCompanyOnline =async (senderId, companyId,handledByUserId,content) => {
    handledByUserId = handledByUserId || 0 ;

   return   await PendingIncomingsModel.create({
       senderId, companyId,handledByUserId,content
    })
}
const saveCustomerWebsiteCompanyOnline =async (name, emailPhoneNumber,companyId) => {

   return   await CustomersModel.create({
        fullName:name,
       companyId,
        phoneNumber: telephoneCheck(emailPhoneNumber) ? emailPhoneNumber: null,
        email: validateEmail(emailPhoneNumber) ? emailPhoneNumber: null,
    })
}

module.exports = {telephoneCheck,saveCustomerIncomingMessageWebsiteCompanyOnline ,validateEmail}